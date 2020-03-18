package kigh.rmt.timer;


public class TimerImpl implements Timer {

    private final TimerId id;
    private String name;
    private int time;
    private boolean running;

    public TimerImpl(TimerMetadata metadata) {
        id = metadata.id;
        name = metadata.name;
        time = 25 * 60;
        running = false;
    }

    @Override
    public void start() {
        running = true;
    }

    @Override
    public void stop() {
        running = false;
    }

    @Override
    public boolean tick() {
        if (!running || time == 0) {
            return false;
        }
        time--;
        if (time == 0) {
            running = false;
            return true;
        }
        return false;
    }

    @Override
    public boolean isRunning() {
        return running;
    }

    @Override
    public int getTime() {
        return time;
    }

    @Override
    public void setTime(int time) {
        if (time < 0) {
            throw new IllegalArgumentException();
        }
        this.time = time;
    }

    @Override
    public TimerId getId() {
        return id;
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public void setName(String name) {
        this.name = name;
    }
}
