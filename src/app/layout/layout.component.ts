import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { SongsService } from 'src/app/core/services/songs.service';
import { MenuItems } from 'src/app/menu-items';
import { Menu } from 'src/app/menu-items.model';
import { SubSink } from 'subsink';
import { ArtistsService } from '../core/services/artists.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainer: NgScrollbar;
  @ViewChild('sidenav') sidenav: MatSidenav;
  userData: any;
  menuList: Menu[];
  isLoading: boolean = false;

  searchControl: FormControl = new FormControl(null);

  private subs = new SubSink();

  constructor(
    private menuItems: MenuItems,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.menuList = this.menuItems.menus;
    this.getAuthenticatedUser();
    this.subsFormControl();
  }

  logOut() {
    this.authService.logOut();
    this.subs.sink = this.authService.endSession().subscribe((resp) => {});
  }

  subsFormControl() {
    this.subs.sink = this.searchControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((resp) => {
        this.router.navigate([`/app/search/${resp}`]);
      });
  }

  getAuthenticatedUser() {
    this.isLoading = true;
    this.subs.sink = this.authService.getAuthenticatedUser().subscribe(
      (resp) => {
        this.userData = resp;
        this.isLoading = false;
        this.authService.authenticatedUser$.next(resp);
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  getUserProfilePicture() {
    return this.userData?.profile_picture?.url
      ? `url(${this.userData.profile_picture.url})`
      : 'url(../../assets/images/default-user-profile.png)';
  }

  onActivate() {
    this.scrollContainer.scrollTo({ top: 0, duration: 0 });
    this.sidenav.close();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
