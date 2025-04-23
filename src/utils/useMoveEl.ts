import { nextTick, ref } from 'vue'

/**
 * @param operationEl 操作的节点
 * @param moveEl 移动的节点 默认值：operationEl
 */
export default (operationEl: HTMLDivElement, moveEl?: HTMLDivElement) => {
    const flag = ref(false)
    const isMove = ref(false)
    nextTick(() => {
        const moveValue = moveEl ?? operationEl
        const moveData = ref<{
            startX: MouseEvent['clientX'], startY: MouseEvent['clientY'],
            moveX: number, moveY: number,
            transX?: number, transY?: number,
            oldMoveX: number, oldMoveY: number
        }>({
            startX: 0, startY: 0, moveX: 0, moveY: 0, oldMoveX: 0, oldMoveY: 0
        })
        operationEl.addEventListener('mousedown', operElMouseDown)
        function operElMouseDown(e: MouseEvent) {
            isMove.value = false
            flag.value = true
            moveData.value.startX = e.clientX
            moveData.value.startY = e.clientY
            window.addEventListener('mousemove', operElMouseMove)
            window.addEventListener('mouseup', operElMouseUp)
        }
        function operElMouseMove(e: MouseEvent) {
            if (flag.value) {
                isMove.value = true
                const { startX, startY, oldMoveX, oldMoveY } = moveData.value
                moveData.value.moveX = e.clientX - startX + oldMoveX
                moveData.value.moveY = e.clientY - startY + oldMoveY
                transformmAnimate()
            }
        }
        function operElMouseUp() {
            if (flag.value) {
                flag.value = false
                moveData.value.oldMoveX = JSON.parse(JSON.stringify(moveData.value.moveX))
                moveData.value.oldMoveY = JSON.parse(JSON.stringify(moveData.value.moveY))
                window.removeEventListener('mousemove', operElMouseMove)
                window.removeEventListener('mouseup', operElMouseUp)
            }
        }
        function transformmAnimate() {
            moveValue.style.transform = `translate(${moveData.value.moveX}px, ${moveData.value.moveY}px)`
        }
    })
}