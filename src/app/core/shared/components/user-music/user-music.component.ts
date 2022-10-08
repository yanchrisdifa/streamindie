import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import moment from 'moment';
import { BehaviorSubject, map, of } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { SongsService } from 'src/app/core/services/songs.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-user-music',
  templateUrl: './user-music.component.html',
  styleUrls: ['./user-music.component.scss'],
})
export class UserMusicComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'number',
    'cover',
    'title',
    'postDate',
    'action',
  ];
  dataSource = new MatTableDataSource([]);
  @Input() songsData: any;
  @Input() artistId: string;
  currentUserId: string;
  hoveredRowId: string;
  currentPlayingSong: any;

  constructor(
    private authService: AuthService,
    private songsService: SongsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.dataSource.data = this.songsData;
    this.currentUserId = this.authService.getLocalStorageUser()?.id;
    this.getCurrentPlayingSong();
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
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
}