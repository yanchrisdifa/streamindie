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
import { distinctUntilChanged } from 'rxjs';
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
  private subs = new SubSink();
  currentPlayingSongDuration: string;
  songProgress: any;

  constructor(
    private songsService: SongsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.getCurrentPlayingSong();
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
    this.songsService.setCurrentPlayingSong(songData);
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
          Math.floor(
            (this.audioPlayer.nativeElement.currentTime * 100) /
              this.audioPlayer.nativeElement.duration
          ) + '%';
        return this.timeFormat(this.audioPlayer.nativeElement.currentTime);
      };
      return this.audioPlayer.nativeElement.ontimeupdate();
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

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
