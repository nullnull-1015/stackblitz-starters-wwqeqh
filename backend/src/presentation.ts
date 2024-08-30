import { Data } from './presentationManager';
import { Animator } from './animator';

export type Option = {
  label: string;
  value: number;
  color: string;
};
export type Vote = {
  id: number;
  value: number;
};

export abstract class Slide {
  protected title: string;
  protected isActive = true;

  constructor(title: string) {
    this.title = title;
  }
  activate() {
    this.isActive = true;
  }
  deactivate() {
    this.isActive = false;
  }
  abstract getHostContents(): Data;
  abstract getGuestContents(): Data;
  abstract isQuestion(): boolean;
}

export abstract class Question extends Slide {
  protected isActive = false;
  protected goal;
  protected count = 0;
  private waitPage = {
    type: 'Wait',
    content: {},
  };
  constructor(title: string, goal: number) {
    super(title);
    this.goal = goal;
  }
  abstract vote(data: Vote);
  abstract getReward();

  getHostContents() {
    return {
      type: 'Game',
      content: this._getContents(),
    };
  }
  getGuestContents() {
    return {
      type: 'Game',
      content: this.isActive ? this._getContents() : this.waitPage,
    };
  }
  protected abstract _getContents(): Data;
}

export class OptionQuestion extends Question {
  private options: Option[];
  private reward: object;

  constructor(title: string, goal: number, options: Option[], reward: object) {
    super(title, goal);
    this.options = options;
    this.reward = reward;
  }

  vote(vote: Vote) {
    let option = this.options[vote.id];
    if (option) {
      option.value += vote.value;
      this.count++;
    }
  }

  _getContents(): Data {
    return {
      type: 'OptionQuestion',
      content: {
        title: this.title,
        options: this.options,
        count: this.count,
        goal: this.goal,
      },
    } as Data;
  }

  getReward() {
    return {
      type: 'Reward',
      content: {
        reward: this.reward,
      },
    };
  }

  isQuestion() {
    return true;
  }
}

export class Presentation {
  private slides: Slide[];
  private theme: Animator;
  private cursor: number = 0;

  constructor(slides: Slide[], theme: Animator) {
    this.slides = slides;
    this.theme = theme;
  }

  next(): Slide {
    if (this.cursor + 1 < this.slides.length) {
      this.cursor++;
    }
    return this.slides[this.cursor];
  }
  curr(): Slide {
    return this.slides[this.cursor];
  }
  back(): Slide {
    if (this.cursor > 0) {
      this.cursor--;
    }
    return this.slides[this.cursor];
  }

  getContents(): Data[] {
    return this.slides.map((slide) => slide.getHostContents());
  }

  getAnimator(): Animator {
    return this.theme;
  }
}
