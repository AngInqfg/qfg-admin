type propType = {
    dis: number,
    bgColor: string,
    arcColor: string,
    linColor: string,
    timer: number,
    totalCount: number,
}
export default defineComponent({
    props: {
        options: {
            type: Object as PropType<propType>,
            default: () => ({
                dis: 80,
                bgColor: 'rgba(30,30,30,0.9)',
                arcColor: 'rgba(255,255,255,0.5)',
                linColor: 'rgba(255,255,255,0.1)',
                timer: 7,
                totalCount: 120
            })
        },
        name: {
            type: String as PropType<string>,
        }
    },
    setup(_prop: { options: propType, name: string }) {
        const canvasEl = useTemplateRef<any>('canvasDomRef');
        const timer = ref()
        watchEffect(() => {
            if (canvasEl.value) {
                createCanvas()
            }
        })
        const op = _prop.options
        class createArc {
            x: number;
            y: number;
            color: string;
            directionY: number;
            directionX: number;
            constructor(x: number, y: number, color: string) {
                this.x = x
                this.y = y
                this.color = color
                this.directionY = 0.5 - Math.random()
                this.directionX = 0.5 - Math.random()
            }
            updateDis() {
                this.y += this.directionY
                this.x += this.directionX
            }
            drawArc(ctxobj: any) {
                ctxobj.beginPath()
                ctxobj.arc(this.x, this.y, 2, 0, Math.PI * 2)
                ctxobj.fillStyle = this.color
                ctxobj.fill()
            }
        }
        function createCanvas() {
            let w = canvasEl.value.clientWidth;
            let h = canvasEl.value.clientHeight;
            canvasEl.value.width = w
            canvasEl.value.height = h
            canvasEl.value.style.background = op.bgColor
            const ctx = canvasEl.value.getContext('2d')
            const arcList: any = []
            function drawAnimate() {
                ctx.clearRect(0, 0, w, h);
                if (arcList.length < op.totalCount) {
                    const x = Math.random() * w
                    const y = Math.random() * h
                    arcList.push(new createArc(x, y, op.arcColor))
                }
                for (let i = 0; i < arcList.length; i++) {
                    const particle = arcList[i]
                    particle.updateDis()
                    particle.drawArc(ctx)
                    if (particle.x < 0 || particle.x > w || particle.y < 0 || particle.y > h) {
                        arcList.splice(i, 1)
                    }
                    for (let j = i; j < arcList.length; j++) {
                        const dx = arcList[i].x - arcList[j].x
                        const dy = arcList[i].y - arcList[j].y
                        const long = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
                        if (long < op.dis) {
                            ctx.beginPath()
                            ctx.strokeStyle = op.linColor
                            ctx.moveTo(arcList[i].x, arcList[i].y)
                            ctx.lineTo(arcList[j].x, arcList[j].y)
                            ctx.lineWidth = 1
                            ctx.stroke()
                        }
                    }
                }
            }
            timer.value = setInterval(() => drawAnimate(), op.timer)
        }
        onUnmounted(() => {
            if (timer.value) {
                clearInterval(timer.value)
            }
        })
        return () => (
            <div style={{ width: '100%', height: '100%', pointerEvents: "none", position: 'relative', zIndex: '-1' }}>
                <canvas style={{ width: '100%', height: '100%', pointerEvents: "none" }} ref="canvasDomRef"></canvas>
                <div class="name" style={{ color: _prop.options.linColor, pointerEvents: "none" }}>{_prop.name}</div >
            </div>
        )
    }
})