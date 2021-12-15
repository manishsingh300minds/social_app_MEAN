import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PostsService } from '../../services/posts.service';
import { ActivatedRoute, Router } from "@angular/router";
import { mimeType } from "./mime-type.validator";
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";
import {AlertComponent} from "../../alert/alert.component";

@Component({
  selector: 'create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  postForm!: FormGroup;
  public mode = 'create';
  post: any;
  editPostId: any;
  cardTitle = '';
  submitText = '';
  imagePreview: any = null;
  imagePath: string | null = '';

  constructor(private postService: PostsService, public route: ActivatedRoute, public router: Router,private alert:MatSnackBar) { }

  ngOnInit(): void {
    this.postForm = new FormGroup({
      'title': new FormControl(null, {
        validators: [Validators.required]
      }),
      'description': new FormControl(null, {
        validators: [Validators.required]
      }),
      'image': new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
    });

    this.route.paramMap.subscribe((param) => {
      if (param.has('title')) {
        this.post = {
          id: param.get('id'),
          title: param.get('title'),
          description: param.get('description'),
          image: param.get('image')
        }
        this.postForm.get('image')?.clearValidators();
        this.editPostId = param.get('id');
        this.mode = 'edit';
        this.cardTitle = 'Update your Post!!'
        this.submitText = 'Update Post';
        this.imagePath = param.get('image');
      }
      else {
        this.post = {};
        this.mode = 'create';
        this.cardTitle = 'Add a new Post!!'
        this.submitText = 'Add Post';
      }
    });
  }

  getFormValidationErrors() {
    Object.keys(this.postForm.controls).forEach(key => {
      const controlErrors: any = this.postForm.get(key)?.errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
    });
  }

  addPost() {
    const newPost = this.postForm.value;
    if (this.mode === 'create') {
      this.postService.addPost(newPost).subscribe((res) => {
            this.alert.openFromComponent(AlertComponent, {
              duration: 2000,
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
              panelClass: 'alertComponent',
              data: {message : 'Added post successfully'}
            });
        this.postForm.reset();
      },
        (error: any) => console.log("Server error:", error));
    }
    else {
      if(this.postForm.value.image == null){
        this.postForm.value.image = this.imagePath
      }
      else{
        this.imagePath = this.postForm.value.image
      }
      this.postService.updatePost(this.editPostId, newPost.title, newPost.description, this.imagePath).subscribe((res) => {
        this.router.navigate(['dashboard','create']);
            this.alert.openFromComponent(AlertComponent, {
              duration: 2000,
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
              panelClass: 'alertComponent',
              data: {message : 'Updated post successfully'}
            });
      },
        (error: any) => console.log("Updating server error:", error));
    }
  }

  onImage(event: Event) {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    this.postForm.patchValue({ image: file });
    this.postForm.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    }
    reader.readAsDataURL(file)
  }
}
