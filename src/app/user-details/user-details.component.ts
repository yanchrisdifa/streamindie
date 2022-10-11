import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { SubSink } from 'subsink';
import { ArtistsService } from '../core/services/artists.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit {
  selectedUserId: string;
  selectedUserData: any;

  private subs = new SubSink();

  constructor(
    private router: ActivatedRoute,
    private artistsService: ArtistsService
  ) {}

  ngOnInit(): void {
    this.subs.sink = this.router.paramMap.subscribe((param) => {
      this.selectedUserId = param.get('id');
      this.getUserDetails();
    });
  }

  getUserDetails() {
    this.subs.sink = this.artistsService
      .getAllArtists(`where:{id:{equals:"${this.selectedUserId}"}}`)
      .subscribe((data) => {
        this.selectedUserData = data[0];
      });
  }
}
