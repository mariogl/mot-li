class CountDownTimer {
  private readonly countdownInterval: number;

  constructor(
    private readonly targetDate: Date,
    private readonly countdownCallback: (countdown: string) => void
  ) {
    this.countdownInterval = window.setInterval(
      this.updateCountdown.bind(this),
      1000
    );
  }

  public stopCountdown() {
    clearInterval(this.countdownInterval);
  }

  private updateCountdown() {
    const currentDate = new Date();
    const timeDifference = this.targetDate.getTime() - currentDate.getTime();

    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    const formattedCountdown = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

    this.countdownCallback(formattedCountdown);
  }
}

export default CountDownTimer;
