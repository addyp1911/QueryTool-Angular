import { Component, Input, OnInit } from '@angular/core';
import { RepoDetails } from '../modify-repository.model';

@Component({
  selector: 'app-repo-card',
  templateUrl: './repo-card.component.html',
  styleUrls: ['./repo-card.component.scss'],
})
export class RepoCardComponent implements OnInit {
  @Input() repo!: RepoDetails;

  constructor() {}

  ngOnInit(): void {}
}
