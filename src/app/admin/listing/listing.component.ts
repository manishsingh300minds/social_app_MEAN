import {Component, OnDestroy, OnInit} from '@angular/core';
import { PostsService } from '../../services/posts.service';
import { Router } from "@angular/router";
import { PostType } from "../../models/post.model";
import {PageEvent} from "@angular/material/paginator";
import {Subscription} from "rxjs";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss']
})
export class ListingComponent implements OnInit,OnDestroy {
  private authSubs!: Subscription;
  isAuthenticated = false;

  postData: PostType[] = [];
  expand = false;
  totalPosts = 0;
  postsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [2,5,10,20];

  constructor(private postService: PostsService, public router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.getPosts(this.postsPerPage,this.currentPage);
    this.isAuthenticated = this.authService.getIsAuth();
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
    });
  }

  deletePost(post: any) {
    const postId = post.id;
    this.postService.deletePost(postId).subscribe(() => {
        this.getPosts(this.postsPerPage,this.currentPage);
        alert(post.title + ' post has been deleted')
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
