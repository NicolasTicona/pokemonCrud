import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'resumeStat'
})
export class ResumeStatPipe implements PipeTransform {

  transform(value: any): any {

    let statResume = value[0].toUpperCase();
    for(let i = 1; i < value.length; i++){
      // console.log(value[i])
      if(value[i] === "-"){
        statResume += value[i+1].toUpperCase()
        // console.log(statResume)

      }
    }

    return statResume ;
  }

}
