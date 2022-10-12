import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import moment from 'moment';
import { BehaviorSubject, forkJoin, map, of } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { GenresService } from 'src/app/core/services/genres.service';
import { SongsService } from 'src/app/core/services/songs.service';
import { SubSink } from 'subsink';
import { UserMusicDialogComponent } from './user-music-dialog/user-music-dialog.component';

@Component({
  selector: 'app-user-music',
  templateUrl: './user-music.component.html',
  styleUrls: ['./user-music.component.scss'],
})
export class UserMusicComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = [
    'number',
    'cover',
    'title',
    'genre',
    'postDate',
  ];
  displayedColumnsCurrentUser: string[] = [
    'number',
    'cover',
    'title',
    'genre',
    'postDate',
    'action',
  ];
  dataSource = new MatTableDataSource([]);
  @Input() artistId: string;
  currentUserId: string;
  hoveredRowId: string;
  currentPlayingSong: any;
  isDataExist: boolean = false;
  isLoading: boolean = false;
  isGenreLoading: boolean = false;

  private subs = new SubSink();
  genresData: any;

  constructor(
    private authService: AuthService,
    private songsService: SongsService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private genresService: GenresService
  ) {}

  ngOnInit(): void {
    this.getAuthenticatedUser();
    this.getCurrentPlayingSong();
    this.getAllGenres();
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
    this.artistId = this.artistId || this.currentUserId;
    this.isLoading = true;
    this.dataSource.data = [];
    this.subs.sink = this.songsService
      .getAllSongs(`where:{artists:{id:{equals:"${this.artistId}"}}}`)
      .subscribe((resp) => {
        if (resp?.length) {
          this.isDataExist = true;
          this.isLoading = false;
          this.dataSource.data = resp;
        }
      });
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

  getAllGenres() {
    this.isGenreLoading = true;
    this.subs.sink = this.genresService
      .getAllGenres('take: 10')
      .subscribe((resp) => {
        this.genresData = resp;
        this.isGenreLoading = false;
      });
  }

  openDialog(type, data?) {
    this.dialog
      .open(UserMusicDialogComponent, {
        disableClose: true,
        width: '600px',
        autoFocus: false,
        data: {
          type: type,
          data: data,
          genresData: this.genresData,
          currentArtistId: this.artistId || this.currentUserId,
        },
      })
      .afterClosed()
      .subscribe((resp) => {
        console.log(resp);
        if (resp?.isSaved) {
          this.getSongsData();
        }
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
