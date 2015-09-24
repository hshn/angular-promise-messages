function scheduler ($timeout, fn) {
    let timer;

    function clearTimer () {
        if (timer) {
            $timeout.cancel(timer);
            timer = null;
        }
    }

    function scheduleFn(delay) {
        if (delay >= 0) {
            timer = $timeout(fn, delay);
        }
    }

    return function schedule (delay) {
        clearTimer();
        scheduleFn(delay);
    }
}

SchedulerFactory.$inject = ['$timeout'];
export function SchedulerFactory ($timeout) {
    return fn => scheduler($timeout, fn);
}


