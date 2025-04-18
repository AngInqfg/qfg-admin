/**
 *  <ERCODE :size="130" :url="url" :lineColor="color"></ERCODE>
 * import ERCODE from '@/components/AErCode/index'
 */
import QRCode from 'qrcode';
import { rgbaToHex } from '@/utils'
export default defineComponent({
    props: {
        size: {
            type: Number as PropType<number>,
            default: 100
        },
        url: {
            type: String as PropType<string>,
            required: true
        },
        centerContentCallback: {
            default: () => { }
        },
        lineColor: {
            type: String as PropType<string>,
            default: '#000000'
        },
        bgColor: {
            type: String as PropType<string>,
            default: '#ffffff'
        },
        margin: {
            type: Number as PropType<number>,
            default: 1
        },
        errorCorrectionLevel: {
            type: String as PropType<'L' | 'M' | 'Q' | 'H'>,
            default: 'H'
        },
        beforeRender: {
            default: () => {
            }
        }
    },
    setup(props: any) {
        const canvasEl = ref<HTMLCanvasElement | null>(null)
        watch(() => props.url, (_new: string) => {
            const canvas: any = document.createElement('canvas')
            QRCode.toCanvas(canvas, _new, {
                width: props.size,
                height: props.size,
                margin: props.margin,  // 边距
                color: {
                    dark: props.lineColor.indexOf('rgba') > -1 ? rgbaToHex(props.lineColor) : props.lineColor,
                    light: props.bgColor.indexOf('rgba') > -1 ? rgbaToHex(props.bgColor) : props.bgColor,
                },
                errorCorrectionLevel: props.errorCorrectionLevel
            }, function (error: any) {
                let img = ''
                if (error) {
                    console.log(error, 'error');
                } else {
                    img = canvas.toDataURL('image/jpeg')
                }
                nextTick(() => {
                    let timer: any = setInterval(async () => {
                        if (canvasEl.value) {
                            const ctx = canvasEl.value?.getContext('2d') as CanvasRenderingContext2D 
                            const image = new Image()
                            image.src = img
                            image.onload = async function () {
                                ctx.drawImage(image, 0, 0, props.size, props.size)
                                if (props.beforeRender !== undefined) {
                                    await props.beforeRender(ctx)
                                }
                                clearInterval(timer)
                                timer = null
                            }
                        }
                    }, 12)
                })
            });
        }, { })
        return () => (
            <canvas width={props.size} height={props.size} ref={canvasEl}></canvas>
        )
    }
})