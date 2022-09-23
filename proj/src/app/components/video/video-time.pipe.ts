import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'videoTime'
})
export class VideoTimePipe implements PipeTransform {
  transform(n: any) {
    if (typeof n === 'number') {
      let totalMin = Math.floor(n / 60)
      let sec = Math.floor(n % 60)
      let totalSec

      sec < 10 ? totalSec = '0' + sec : totalSec = sec

      return totalMin + ":" + totalSec
    } else {
      return null
    }
  }
}