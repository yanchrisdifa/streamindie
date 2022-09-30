import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'separateTitle' })
export class SongTitleSeparator implements PipeTransform {
  transform(value: string, type: string): string {
    let temp: string[] = value.split('-');
    return type === 'artist' ? temp[0] : type === 'title' ? temp[1] : value;
  }
}
