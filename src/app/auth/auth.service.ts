import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, pipe, Subject} from "rxjs";
import {catchError} from "rxjs/operators";
import {AuthData} from "../models/authDataModel";
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class AuthService{
    api = environment.authUrl;
    private token!: string | null;
    private isAuth = false;
    private authStatusListener = new Subject<boolean>();
    private tokenTimer: any;
    private userId!: string | null;

    constructor(private http : HttpClient, private router: Router) {
    }

    getToken(){
        return this.token;
    }

    getIsAuth(){
        return this.isAuth;
    }

    getAuthStatusListener(){
        return this.authStatusListener.asObservable();
    }

    getUserId(){
        return this.userId;
    }

    autoAuthUser(){
        const authInfo = this.getAuthData();
        const now = new Date();
        if(authInfo){
            const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
            if(expiresIn > 0){
                this.token = authInfo.token;
                this.isAuth = true;
                this.userId = authInfo.userId;
                this.setAuthTimer(expiresIn / 1000);
                this.authStatusListener.next(true);
            }
        }
    }

    createUser(email : string, password : string): Observable<any> {
        const user: AuthData = {
            email: email,
            password: password
        }
      return  this.http.post<AuthData>(this.api+'/signup',user).pipe(catchError(this.handleError));
    }

    loginUser(email: string, password: string): any{
        const user: AuthData = {
            email: email,
            password: password
        }
        return this.http.post<AuthData>(this.api+'/login',user).subscribe((res: any) => {
                this.token = res.token;
                if(this.token){
                    const now = new Date();
                    const expireDuration = res.expiresIn;
                    const expirationDate = new Date(now.getTime() + expireDuration * 1000);
                    this.setAuthTimer(expireDuration);
                    this.isAuth = true;
                    this.authStatusListener.next(true);
                    this.userId = res.userId;
                    this.saveAuthData(this.token,expirationDate,this.userId);
                    this.router.navigate(['/']);
                }
            },
            pipe(catchError(this.handleError))
        );
    }

    logoutUser(){
        this.token = null;
        this.isAuth = false;
        this.userId = null;
        this.authStatusListener.next(false);
        this.router.navigate(['/']);
        this.clearAuthData();
        clearTimeout(this.tokenTimer);
    }

    private saveAuthData(token: string, expirationDate: Date, userId: any){
        localStorage.setItem('token',token);
        localStorage.setItem('expiration',expirationDate.toISOString());
        localStorage.setItem('userId',userId);
    }

    private clearAuthData(){
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');
    }

    private getAuthData(){
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        const userId = localStorage.getItem('userId');
        if(!token || !expirationDate){
            return;
        }
        return{
            token: token,
            expirationDate: new Date(expirationDate),
            userId: userId
        }
    }

    private setAuthTimer(duration: number){
        this.tokenTimer =  setTimeout(() => {
            this.logoutUser();
        }, duration * 1000);
    }

    private handleError(errorResponse: HttpErrorResponse): Observable<any> {
        if (errorResponse.error instanceof Error) {
            console.log("Client Side Error:", errorResponse.error.message);
        }
        else {
            console.log("Client Side Error:", errorResponse);
        }
        return errorResponse.error;
    }
}
