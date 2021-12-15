import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import {Injectable} from "@angular/core";
import {ErrorComponent} from "./error/error.component";

@Injectable()
export class ErrorInterceptor implements  HttpInterceptor{

    constructor(private modalService: MatDialog) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage = "An unknown error occurred!!";
                if(error.error.message){
                    errorMessage = error.error.message;
                }
                console.log("Handle error",error,errorMessage);
                const dataToSend = {
                    message : errorMessage
                }
                this.modalService.open(ErrorComponent, {data: dataToSend});
                return throwError(error);
            })
        );
    }
}
