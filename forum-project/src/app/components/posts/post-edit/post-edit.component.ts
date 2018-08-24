import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService } from '../../../core/services/posts/posts.service';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../core/store/app.state';
import { AuthService } from '../../../core/services/auth/auth.service';
import { PostEditModel } from '../../../core/models/posts/postEdit.model';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.scss']
})
export class PostEditComponent extends BaseComponent {
  protected postId: string;
  protected editForm;
  protected categories;
  private subscriptionCat$: Subscription;
  private subscriptionPost$: Subscription;

  constructor(private route: ActivatedRoute, private postService: PostsService,
    private store: Store<AppState>, private router: Router, private authService: AuthService, protected fb: FormBuilder) {
      super();
      this.postId = this.route.snapshot.paramMap.get('id');
      this.subscriptionCat$ = this.store
      .pipe(select(st => st.categories.all))
      .subscribe(categories => {
        this.categories = categories;
      });
      this.subscriptionPost$ = this.store.pipe(select(st => st.posts.all))
        .subscribe(posts => {
          if (posts.length > 0) {
            const post = posts.find(p => p._id === this.postId);
            if (!post) {
              this.router.navigate(['404']);
              return;
            }
            if (post.authorName !== this.authService.userName || !this.authService.isAdmin()) {
              this.router.navigate(['/posts']);
              return;
            }
            this.editForm = this.fb.group({
              category: [post.category.name, [Validators.required]],
              title: [post.title, [Validators.required, Validators.minLength(6)]],
              body: [post.body, [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
              authorName: [post.authorName]
            });

            console.log(this.editForm);
          } else {
            this.router.navigate(['404']);
            return;
          }
        });

      this.subscriptions.push(this.subscriptionCat$);
      this.subscriptions.push(this.subscriptionPost$);
  }

  get category() { return this.editForm.get('category'); }

  get title() { return this.editForm.get('title'); }

  get body() { return this.editForm.get('body'); }

  editPost() {
    const form = this.editForm.value;
    this.postService.editPost(this.postId, form);
  }
}
