import {Component, OnDestroy, OnInit} from '@angular/core';
import { PostsService } from '../../services/posts.service';
import { Router } from "@angular/router";
import { PostType } from "../../models/post.model";
import {PageEvent} from "@angular/material/paginator";
import {Subscription} from "rxjs";
import {AuthService} from "../../auth/auth.service";
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";
import {AlertComponent} from "../../alert/alert.component";

@Component({
  selector: 'listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss']
})
export class ListingComponent implements OnInit,OnDestroy {
  private authSubs!: Subscription;
  isAuthenticated = false;

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  userId!: string | null;
  postData: PostType[] = [];
  expand = false;
  totalPosts = 0;
  postsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [2,5,10,20];

  constructor(private postService: PostsService, public router: Router, private authService: AuthService, private alert:MatSnackBar) {}

  ngOnInit(): void {
    this.getPosts(this.postsPerPage,this.currentPage);
    this.isAuthenticated = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();
    this.authSubs = this.authService.getAuthStatusListener().subscribe( authValue => {
      this.isAuthenticated = authValue;
    });
  }

  ngOnDestroy(): void {
    this.authSubs.unsubscribe();
  }

  getPosts(postsPerPage : number,currentPage: number) {
    this.postService.getPosts(postsPerPage,currentPage).subscribe((postsData) => {
      this.postData = postsData.posts;
      this.totalPosts = postsData.maxPosts;
      this.userId = this.authService.getUserId();
    });
  }

  deletePost(post: any) {
    const postId = post.id;
    this.postService.deletePost(postId).subscribe((res) => {
        this.alert.openFromComponent(AlertComponent, {
          duration: 2000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          panelClass: 'alertComponent',
          data: {message : 'Deleted post successfully'}
        });
        this.getPosts(this.postsPerPage,this.currentPage);
      },
      (err) => console.log("Error: ", err)
    );
    this.postData = this.postData.filter(data => data !== post);
  }

  onChangePage(event : PageEvent){
    this.currentPage = event.pageIndex+1;
    this.postsPerPage = event.pageSize;
    this.getPosts(this.postsPerPage,this.currentPage);
  }
}
