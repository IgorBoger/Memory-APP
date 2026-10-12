import type { PausableTimer } from "../types";


/**
 * Creates timer data without starting a timeout.
 */
export function createPausableTimer(): PausableTimer {
    return {
        timeoutId: undefined,
        remaining: 0,
        startedAt: 0,
        action: undefined,
    };
}


/**
 * Stops the timer and discards its remaining time and pending action.
 */
export function cancelTimer(timer: PausableTimer) {
    window.clearTimeout(timer.timeoutId);
    timer.timeoutId = undefined;
    timer.remaining = 0;
    timer.action = undefined;
}


/**
 * Resets the expired timer before running its pending action.
 */
function finishTimer(timer: PausableTimer) {
    const callback = timer.action;
    cancelTimer(timer);
    callback?.();
}


/**
 * Starts a prepared or paused timer using its remaining time.
 * Does nothing if the timer is already running or has no pending action.
 */
export function resumeTimer(timer: PausableTimer) {
    if (!timer.action || timer.timeoutId !== undefined) return;
    timer.startedAt = performance.now();
    timer.timeoutId = window.setTimeout(
        () => finishTimer(timer),
        timer.remaining
    );
}


/**
 * Pauses a running timer and stores its remaining time.
 */
export function pauseTimer(timer: PausableTimer) {
    if (timer.timeoutId === undefined) return;
    window.clearTimeout(timer.timeoutId);
    timer.timeoutId = undefined;
    const elapsed = performance.now() - timer.startedAt;
    timer.remaining = Math.max(0, timer.remaining - elapsed);
}


/**
 * Replaces the pending timer action and starts a new timeout.
 *
 * @param timer - Timer data used for this action.
 * @param callback - Action to run when the timeout expires.
 * @param delay - Delay in milliseconds; 1000 equals one second.
 */
export function startTimer(
    timer: PausableTimer,
    callback: () => void,
    delay: number
) {
    cancelTimer(timer);
    timer.action = callback;
    timer.remaining = delay;
    resumeTimer(timer);
}
