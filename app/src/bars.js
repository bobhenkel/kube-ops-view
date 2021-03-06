import {FACTORS, getBarColor} from './utils'
import App from './app'

const PIXI = require('pixi.js')

export default class Bars extends PIXI.Graphics {
    constructor(entity, resources, tooltip) {
        super()
        this.entity = entity
        this.resources = resources
        this.tooltip = tooltip
    }

    draw() {
        const bars = this

        const barHeight = 92

        bars.beginFill(App.current.theme.primaryColor, 0.1)
        bars.drawRect(5, 110 - barHeight, 15, barHeight)
        bars.endFill()

        // CPU
        const cpuHeight = barHeight / bars.resources.cpu.capacity
        bars.interactive = true
        bars.lineStyle(0, 0xaaffaa, 1)
        bars.beginFill(getBarColor(bars.resources.cpu.requested, bars.resources.cpu.capacity), 1)
        bars.drawRect(5, 110 - bars.resources.cpu.requested * cpuHeight, 2.5, bars.resources.cpu.requested * cpuHeight)
        bars.beginFill(getBarColor(bars.resources.cpu.used, bars.resources.cpu.capacity), 1)
        bars.drawRect(7.5, 110 - bars.resources.cpu.used * cpuHeight, 2.5, bars.resources.cpu.used * cpuHeight)
        bars.endFill()

        // Memory
        const scale = bars.resources.memory.capacity / barHeight
        bars.lineStyle(0, 0xaaffaa, 1)
        bars.beginFill(getBarColor(bars.resources.memory.requested, bars.resources.memory.capacity), 1)
        bars.drawRect(14, 110 - bars.resources.memory.requested / scale, 2.5, bars.resources.memory.requested / scale)
        bars.beginFill(getBarColor(bars.resources.memory.used, bars.resources.memory.capacity), 1)
        bars.drawRect(16.5, 110 - bars.resources.memory.used / scale, 2.5, bars.resources.memory.used / scale)
        bars.endFill()

        bars.lineStyle(1, App.current.theme.primaryColor, 1)
        for (var i = 0; i < bars.resources.cpu.capacity; i++) {
            bars.drawRect(5, 110 - (i + 1) * cpuHeight, 5, cpuHeight)
        }

        bars.drawRect(14, 110 - bars.resources.memory.capacity / scale, 5, bars.resources.memory.capacity / scale)

        bars.on('mouseover', function () {
            let s = 'CPU: \n'
            const {capacity: cpuCap, requested: cpuReq, used: cpuUsed} = bars.resources.cpu
            s += '\t\t Capacity  : ' + cpuCap + '\n'
            s += '\t\t Requested : ' + cpuReq.toFixed(2) + '\n'
            s += '\t\t Used      : ' + cpuUsed.toFixed(2) + '\n'
            s += '\nMemory: \n'

            const {capacity: memCap, requested: memReq, used: memUsed} = bars.resources.memory
            s += '\t\t Capacity  : ' + (memCap / FACTORS.Gi).toFixed(2) + ' GiB\n'
            s += '\t\t Requested : ' + (memReq / FACTORS.Gi).toFixed(2) + ' GiB\n'
            s += '\t\t Used      : ' + (memUsed / FACTORS.Gi).toFixed(2) + ' GiB\n'

            s += '\nPods: \n'
            const {capacity: podsCap, used: podsUsed} = bars.resources.pods
            s += '\t\t Capacity  : ' + podsCap + '\n'
            s += '\t\t Used      : ' + podsUsed + '\n'

            bars.tooltip.setText(s)
            bars.tooltip.position = bars.toGlobal(new PIXI.Point(22, 16))
            bars.tooltip.visible = true
        })
        bars.on('mouseout', function () {
            bars.tooltip.visible = false
        })

        return bars
    }

}

