import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { debounce, fromEvent, interval, sample, scan } from 'rxjs';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {
  video: any | {
    currentTime: number,
    duration: number,
    percentTime: number,
    percentBuffer: number,
    controls: string
  }

  @Input() url: any;

  @ViewChild('screen') screen: any;
  @ViewChild('media') media: any;
  @ViewChild('controls') controls: any;
  @ViewChild('progressGrid') progressGrid: any;
  @ViewChild('progressValue') progressValue: any;
  @ViewChild('playPauseIcon') playPauseIcon: any;
  @ViewChild('volumeBar') volumeBar: any;
  @ViewChild('volumeIcon') volumeIcon: any;
  @ViewChild('fullscreenIcon') fullscreenIcon: any;

  constructor() {
    this.video = {
      currentTime: 0,
      duration: 0,
      percentTime: 0,
      percentBuffer: 0,
      controls: 'flex'
    }
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.setDefault()
      window.addEventListener('resize', () => {
        this.checkFullscreen()

        if(window.innerWidth < 768) {
          this.changeVolume('1')
        }
      })
      this.media.nativeElement.addEventListener('timeupdate', (e: any) => {
        this.video.percentTime = this.media.nativeElement.currentTime * 100 / this.media.nativeElement.duration + "%"
        this.progressValue.nativeElement.value = this.media.nativeElement.currentTime * 100 / this.media.nativeElement.duration
        this.video.currentTime = this.media.nativeElement.currentTime
        this.video.duration = this.media.nativeElement.duration
      });
      this.media.nativeElement.addEventListener('click', (e: any) => {
        this.control('playPause')
      });
      this.media.nativeElement.addEventListener('dblclick', (e: any) => {
        this.control('fullscreen')
      });
      interval(300)
        .pipe(sample(fromEvent(this.screen.nativeElement, 'mousemove')))
        .subscribe((res: any) => {
          this.showControls()
        })
    }, 500)
  }

  hideControls() {
    if (this.media.nativeElement.paused) {
      return;
    }

    this.video.controls = 'none'
  }
  timer: any
  showControls() {
    this.video.controls = 'flex';
    
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      if(!this.media.nativeElement.paused) {
        this.video.controls = 'none'
      }
    }, 2000);
  }

  setDefault() {
    this.checkFullscreen()
    window.innerWidth < 768 ? this.changeVolume('1') : this.changeVolume('0.5')
  }

  changeProgress() {
    this.media.nativeElement.pause()
    this.media.nativeElement.currentTime = this.progressValue.nativeElement.value * this.media.nativeElement.duration / 100
  }

  checkFullscreen() {
    if (
      window.innerWidth != screen.width &&
      window.innerHeight != screen.height
      ) {
      this.fullscreenIcon.nativeElement.innerHTML = 'fullscreen'
    } else {
      this.fullscreenIcon.nativeElement.innerHTML = 'fullscreen_exit'
    }
  }

  control(command: string) {
    switch (command) {
      case 'playPause':
        if (this.media.nativeElement.paused) {
          this.playPauseIcon.nativeElement.innerHTML = "pause"
          this.media.nativeElement.play()
        } else {
          this.playPauseIcon.nativeElement.innerHTML = "play_arrow"
          this.media.nativeElement.pause()
        }  
        break;
      case 'fullscreen':
        if (document.fullscreenElement === null ||
          (window.innerWidth != screen.width &&
          window.innerHeight != screen.height)) {
          if (this.screen.nativeElement.requestFullscreen) {
            this.screen.nativeElement.requestFullscreen();
          } else if (this.screen.nativeElement.msRequestFullscreen) {
            this.screen.nativeElement.msRequestFullscreen();
          } else if (this.screen.nativeElement.mozRequestFullScreen) {
            this.screen.nativeElement.mozRequestFullScreen();
          } else if (this.screen.nativeElement.webkitRequestFullscreen) {
            this.screen.nativeElement.webkitRequestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }
        break
      case 'replay10':
        this.media.nativeElement.currentTime -= 10
        break
      case 'forward10':
        this.media.nativeElement.currentTime += 10
        break
      case 'mute':
        this.changeVolume('0');
        break
    }
  }

  changeVolume(volume?: string) {
    if(volume) {
      this.volumeBar.nativeElement.value = volume
    }
    this.media.nativeElement.volume = parseFloat(this.volumeBar.nativeElement.value);
    if (this.volumeBar.nativeElement.value >= 0.7) {
      this.volumeIcon.nativeElement.innerHTML = 'volume_up'
    }
    if (
      this.volumeBar.nativeElement.value <= 0.69 &&
      this.volumeBar.nativeElement.value >= 0.3
      ) {
      this.volumeIcon.nativeElement.innerHTML = 'volume_down'
    }
    if (
      this.volumeBar.nativeElement.value <= 0.29 &&
      this.volumeBar.nativeElement.value >= 0.01
      ) {
      this.volumeIcon.nativeElement.innerHTML = 'volume_mute'
    }
    if (this.volumeBar.nativeElement.value == 0) {
      this.volumeIcon.nativeElement.innerHTML = 'volume_off'
    }
  }

  
}
