import { Data, Reply } from './presentationManager';

export type AnimRequest = {
  type: string;
  target: string;
  damage?: number;
  isLast?: boolean;
};

export abstract class Animator {
  abstract handle(req: AnimRequest): Reply[];
}

export class DogAnimator extends Animator {
  private setting;
  constructor() {
    super();
    // 将来的には JSON から読み込む
    this.setting = {
      main: {
        url: 'https://localhost:3000/resource/anim/dog/runningdog.jpg',
        width: 1048,
        flame: 7,
        fps: 16,
        interrupt: false,
        index: 0,
        pos: 0,
        loop: -1,
        count: 0,
      },
      success: {
        url: 'https://localhost:3000/resource/anim/dog/success_runningdog.jpg',
        width: 1048,
        flame: 18,
        fps: 16,
        interrupt: true,
        index: 0,
        pos: 0,
        loop: 1,
        count: 0,
      },
      fail: {
        url: 'https://localhost:3000/resource/anim/dog/fail_runningdog.jpg',
        width: 1048,
        flame: 13,
        fps: 16,
        interrupt: true,
        index: 0,
        pos: 0,
        loop: 1,
        count: 0,
      },
      in: {
        url: 'https://localhost:3000/resource/anim/dog/in_runningdog.jpg',
        width: 1048,
        height: 260,
        flame: 8,
        fps: 16,
        interrupt: true,
        index: 0,
        pos: 0,
        loop: 1,
        count: 0,
      },
      out: {
        url: 'https://localhost:3000/resource/anim/dog/out_runningdog.jpg',
        width: 1048,
        height: 260,
        flame: 18,
        fps: 16,
        interrupt: true,
        index: 0,
        pos: 0,
        loop: 1,
        count: 0,
      },
      wait: {
        url: 'https://localhost:3000/resource/anim/dog/wait.jpg',
        width: 1048,
        height: 260,
        flame: 1,
        fps: 0.5,
        interrupt: true,
        index: 0,
        pos: 0,
        loop: 1,
        count: 0,
      },
    };
  }

  handle(req: AnimRequest): Reply[] {
    console.log(req.type);
    switch (req.type) {
      case 'anim-start':
        return [
          {
            type: 'anim',
            target: req.target,
            content: {
              type: 'Anim',
              content: {
                animQueue: [
                  this.setting['wait'],
                  this.setting['in'],
                  this.setting['main'],
                ],
              },
            },
          },
        ];
      case 'anim-stop': {
        return [
          {
            type: 'anim',
            target: req.target,
            content: {
              type: 'Anim',
              content: {
                animQueue: [this.setting['out']],
              },
            },
          },
        ];
      }
      case 'anim-success': {
        const succsess = this.setting['success'];
        succsess.damage = req.damage;
        succsess.isLast = req.isLast;
        return [
          {
            type: 'anim',
            target: req.target,
            content: {
              type: 'Anim',
              content: {
                animQueue: [succsess],
              },
            },
          },
        ];
      }
      case 'anim-fail': {
        const fail = this.setting['fail'];
        fail.damage = req.damage;
        fail.isLast = req.isLast;
        return [
          {
            type: 'anim',
            target: req.target,
            content: {
              type: 'Anim',
              content: {
                animQueue: [fail],
              },
            },
          },
        ];
      }
    }
    return [];
  }
}
