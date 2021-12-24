import { Pipe, PipeTransform } from '@angular/core';
import { Task } from 'src/app/theme/shared/task.model';

@Pipe({
  name: 'taskFilter'
})
export class TaskFilterPipe implements PipeTransform {

  transform(task: Task[], searchTerm: string): Task[] {
    if(!task || !searchTerm)
    return task;

    return task.filter(task =>
      task.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
      task.status.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
      task.description.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
    )
  }

}
