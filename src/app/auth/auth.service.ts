import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {AuthData} from "../models/authDataModel";
import {environment} from "../../environments/environment";
import {AlertComponent} from "../alert/alert.component";
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";

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
    horizontalPosition: MatSnackBarHorizontalPosition = 'end';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    constructor(private http : HttpClient, private router: Router, private alert:MatSnackBar) {
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

    createUser(email : string, password : string): void {
        const user: AuthData = {
            email: email,
            password: password
        }
      this.http.post<AuthData>(this.api+'/signup',user).subscribe((res : any) => {
          this.alert.openFromComponent(AlertComponent, {
              duration: 2000,
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
              panelClass: 'alertComponent',
              data: {message : res.message}
          });
          this.router.navigate(['auth','signup']);
      },
      (error : any) => {
          this.router.navigate(['auth','signup']);
      });
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
            (err) => {
            this.router.navigate(['auth','login']);
            }
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
        this.alert.openFromComponent(AlertComponent, {
            duration: 2000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            panelClass: 'alertComponent',
            data: {message : 'Logged out successfully'}
        });
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
}
