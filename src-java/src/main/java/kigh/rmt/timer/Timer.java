package kigh.rmt.timer;

interface Timer {
    void start();
    void stop();

    /**
     *
     * @return true when time is over
     */
    boolean tick();
    boolean isRunning();

    int getTime();
    void setTime(int time);
    
    TimerId getId();

    String getName();
    void setName(String name);
}
