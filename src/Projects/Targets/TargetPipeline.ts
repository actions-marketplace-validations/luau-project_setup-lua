import { ITarget } from "./ITarget";
import { ITargetPipeline } from "./ITargetPipeline";

export class TargetPipeline implements ITargetPipeline {
    private initialTarget: ITarget;

    constructor(initialTarget: ITarget) {
        this.initialTarget = initialTarget;
    }

    init(): Promise<ITarget> {
        return new Promise<ITarget>((resolve, reject) => {
            resolve(this.initialTarget);
        });
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            resolve();
        });
    }
    execute(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let failed = false;
            let finished = false;
            let err: any;

            this.init()
                .then(tgt => {
                    const iter = (target: ITarget) => {
                        if (!(failed || finished)) {
                            target.init()
                                .then(() => {
                                    target.execute()
                                        .then(() => {
                                            target.finalize()
                                                .then(() => {
                                                    const nextTarget = target.getNext();

                                                    if (!nextTarget) {
                                                        finished = true;
                                                    }

                                                    iter(<ITarget>nextTarget);
                                                })
                                                .catch(finalizeErr => {
                                                    failed = true;
                                                    err = finalizeErr;
                                                    iter(target);
                                                });
                                        })
                                        .catch(execErr => {
                                            target.finalize()
                                                .then(() => {
                                                    failed = true;
                                                    err = execErr;
                                                    iter(target);
                                                })
                                                .catch(finalizeErr => {
                                                    failed = true;
                                                    err = finalizeErr;
                                                    iter(target);
                                                });
                                        });
                                })
                                .catch(initErr => {
                                    failed = true;
                                    err = initErr;
                                    iter(target);
                                });
                        }
                        else if (err) {
                            this.finalize()
                                .then(() => {
                                    reject(err);
                                })
                                .catch(reject);
                        }
                        else {
                            this.finalize()
                                .then(resolve)
                                .catch(reject);
                        }
                    };

                    iter(tgt);
                })
                .catch(reject);
        });
    }
}