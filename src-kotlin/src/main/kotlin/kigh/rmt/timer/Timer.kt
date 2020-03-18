package kigh.rmt.timer

interface Timer {
    fun start()
    fun stop()
    /**
     * @return true when time is over
     */
    fun tick(): Boolean

    val isRunning: Boolean
    var time: Int
    val id: TimerId
    var name: String
}