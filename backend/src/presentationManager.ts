import { Presentation, Slide, Question, Vote } from './presentation';
import { Animator, AnimRequest } from './animator';

class Logger extends Array {}

export type Data = {
  type: string;
  content: object;
};

export type Message = {
  type: string;
  user: string;
  content: object;
};

export type Reply = {
  target: string;
  type: string;
  content: Data;
};

export class PresentationManager {
  private presentation: Presentation;
  private log = new Logger();

  constructor(presentation: Presentation) {
    this.presentation = presentation;
  }

  handle(message: Message): Reply[] {
    console.log(message);
    this.log.push(message);

    switch (message.type) {
      // paging
      case 'next':
        this.presentation.curr().deactivate();
        this.presentation.next();
        return [
          {
            target: 'host',
            type: 'update',
            content: this.presentation.curr().getHostContents(),
          },
          {
            target: 'guest',
            type: 'update',
            content: this.presentation.curr().getGuestContents(),
          },
        ];
      case 'prev':
        this.presentation.curr().deactivate();
        this.presentation.back();
        return [
          {
            target: 'host',
            type: 'update',
            content: this.presentation.curr().getHostContents(),
          },
          {
            target: 'guest',
            type: 'update',
            content: this.presentation.curr().getGuestContents(),
          },
        ];
      case 'curr':
        let content =
          message.user === 'host'
            ? this.presentation.curr().getHostContents()
            : this.presentation.curr().getGuestContents();
        return [
          {
            target: 'sender',
            type: 'update',
            content: content,
          },
        ];
      case 'reward': {
        const slide = this.presentation.curr();
        if (slide.isQuestion()) {
          const question: Question = slide as Question;
          return [
            { target: 'guest', type: 'update', content: question.getReward() },
          ];
        }
        break;
      }
      // anquate
      case 'start':
        this.presentation.curr().activate();
        return [
          {
            target: 'guest',
            type: 'update',
            content: this.presentation.curr().getGuestContents(),
          },
        ];
      case 'stop':
        this.presentation.curr().deactivate();
        return [
          {
            target: 'guest',
            type: 'update',
            content: this.presentation.curr().getGuestContents(),
          },
        ];
      case 'vote': {
        const vote = message.content as Vote;
        const slide = this.presentation.curr();
        if (slide.isQuestion()) {
          const question: Question = slide as Question;
          question.vote(vote);
          return [
            {
              target: 'host',
              type: 'update',
              content: slide.getHostContents(),
            },
            {
              target: 'sender',
              type: 'update',
              content: { type: 'Wait', content: {} },
            },
          ];
        }
      }
      case 'anim': {
        const animReq = message.content as AnimRequest;
        return this.presentation.getAnimator().handle(animReq);
      }
    }
    return [];
  }
}
