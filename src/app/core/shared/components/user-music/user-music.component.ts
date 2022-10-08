import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import moment from 'moment';
import { BehaviorSubject, forkJoin, map, of } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { SongsService } from 'src/app/core/services/songs.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-user-music',
  templateUrl: './user-music.component.html',
  styleUrls: ['./user-music.component.scss'],
})
export class UserMusicComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['number', 'cover', 'title', 'postDate'];
  displayedColumnsCurrentUser: string[] = [
    'number',
    'cover',
    'title',
    'postDate',
    'action',
  ];
  dataSource = new MatTableDataSource([]);
  @Input() songsData$: any;
  @Input() artistId: string;
  currentUserId: string;
  hoveredRowId: string;
  currentPlayingSong: any;
  isDataExist: boolean = false;
  isLoading: boolean = false;

  private subs = new SubSink();

  constructor(
    private authService: AuthService,
    private songsService: SongsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getAuthenticatedUser();
    this.getCurrentPlayingSong();
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  getAuthenticatedUser() {
    this.isLoading = true;
    this.subs.sink = this.authService.getAuthenticatedUser().subscribe(
      (resp) => {
        this.isLoading = false;
        this.currentUserId = resp?.id;
        this.getSongsData();
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  getSongsData() {
    this.isLoading = true;
    this.dataSource.data = [];
    this.subs.sink = this.songsData$.subscribe(
      (resp) => {
        this.isLoading = false;
        if (resp?.length) {
          this.isDataExist = true;
          this.dataSource.data = resp;
        }
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  getSongCover(imageUrl: string) {
    return `url(${imageUrl})`;
  }

  formatSongPostedAt(date: string) {
    return moment(date).format('MMMM Do YYYY');
  }

  setPlayIcon(row, type) {
    if (type === 'enter') {
      this.hoveredRowId = row.id;
    } else if (type === 'out') {
      this.hoveredRowId = null;
    }
  }

  setCurrentPlayingSong(songData: any) {
    this.songsService.setCurrentPlayingSong(songData);
  }

  getCurrentPlayingSong() {
    this.songsService.currentPlayingSong$.subscribe((song) => {
      this.currentPlayingSong = song;
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
