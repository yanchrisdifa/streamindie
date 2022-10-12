import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { distinctUntilChanged, of } from 'rxjs';
import { GenresService } from 'src/app/core/services/genres.service';
import { SongsService } from 'src/app/core/services/songs.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
})
export class AudioPlayerComponent implements OnInit, AfterViewInit, OnDestroy {
  currentPlayingSong: any = null;
  @ViewChild('audioPlayer') audioPlayer: ElementRef;
  @ViewChild('songProgressContainer') songProgressContainer: ElementRef;
  private subs = new SubSink();
  currentPlayingSongDuration: string;
  songProgress: string = '0%';
  songCurrentTime: string = '0:00';
  currentPlayingGenre: any;

  constructor(
    private songsService: SongsService,
    private cdr: ChangeDetectorRef,
    private genresService: GenresService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.getCurrentPlayingSong();
    this.getCurrentTime();
    this.getCurrentPlayingGenre();
    this.cdr.detectChanges();
  }

  getCurrentPlayingSong(): void {
    let oldPlayingSongId: string = JSON.parse(
      localStorage.getItem('currentPlayingSong')
    )?.id;
    let isPageReloaded =
      window.performance.getEntriesByType('navigation')[0]['type'] === 'reload'
        ? true
        : false;
    this.subs.sink = this.songsService.currentPlayingSong$.subscribe((data) => {
      if (data) {
        if (this.audioPlayer) {
          this.currentPlayingSong = data;
          if (isPageReloaded && !oldPlayingSongId) {
            isPageReloaded = false;
          }
          if (!isPageReloaded) {
            if (oldPlayingSongId === this.currentPlayingSong.id) {
              if (!this.currentPlayingSong?.isPlayed) {
                this.audioPlayer.nativeElement.pause();
              } else {
                this.audioPlayer.nativeElement.play();
              }
            } else {
              this.audioPlayer.nativeElement.load();
              this.audioPlayer.nativeElement.play();
            }
            oldPlayingSongId = data?.id;
          } else {
            isPageReloaded = false;
            if (
              this.currentPlayingSong?.id &&
              this.currentPlayingSong?.isPlayed === true
            ) {
              this.songsService.oldPlayingSongId = this.currentPlayingSong?.id;
              this.songsService.rawCurrentPlayingSong = this.currentPlayingSong;
              this.songsService.setCurrentPlayingSong(this.currentPlayingSong);
            }
          }
        }
      } else {
        this.currentPlayingSong = null;
        oldPlayingSongId = null;
      }
    });
  }

  setCurrentPlayingSong(songData: any) {
    if (songData) {
      if (this.currentPlayingGenre?.id) {
        this.genresService.setCurrentPlayingGenre(this.currentPlayingGenre);
      }
      this.songsService.setCurrentPlayingSong(songData);
    }
  }

  getDuration() {
    if (this.audioPlayer?.nativeElement) {
      this.audioPlayer.nativeElement.onloadedmetadata = () => {
        if (
          !isNaN(this.audioPlayer.nativeElement.duration) &&
          typeof this.audioPlayer.nativeElement.duration === 'number'
        ) {
          return this.timeFormat(this.audioPlayer.nativeElement.duration);
        }
      };
      return this.audioPlayer.nativeElement.onloadedmetadata();
    }
  }

  getCurrentTime() {
    if (this.audioPlayer?.nativeElement) {
      this.audioPlayer.nativeElement.ontimeupdate = () => {
        this.songProgress =
          (this.audioPlayer.nativeElement.currentTime * 100) /
            this.audioPlayer.nativeElement.duration +
          '%';
        this.songCurrentTime = this.timeFormat(
          this.audioPlayer.nativeElement.currentTime
        );
        if (
          this.audioPlayer.nativeElement.currentTime ===
          this.audioPlayer.nativeElement.duration
        ) {
          this.songsService.setCurrentPlayingSong(this.currentPlayingSong);
        }
      };
    }
  }

  timeFormat(time: number) {
    return (
      Math.floor(time / 60) +
      ':' +
      (Math.floor(time % 60) < 10
        ? '0' + Math.floor(time % 60)
        : Math.floor(time % 60))
    );
  }

  getCurrentPlayingGenre() {
    this.genresService.currentPlayingGenre$.subscribe((data) => {
      this.currentPlayingGenre = data;
    });
  }

  goToDuration(event: PointerEvent) {
    const progressWidthClicked: number =
      event.clientX -
      this.songProgressContainer.nativeElement.getBoundingClientRect().left;
    const fullProgressWidth =
      this.songProgressContainer.nativeElement.clientWidth;
    const songDuration = this.audioPlayer.nativeElement.duration;
    const percentageProgressWidth =
      (progressWidthClicked / fullProgressWidth) * 100;
    const songClickedDuration = (songDuration * percentageProgressWidth) / 100;
    this.audioPlayer.nativeElement.currentTime = songClickedDuration;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
