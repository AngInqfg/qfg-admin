/**
 *  <IconSvg name="assetsIconSvgName"></IconSvg>
 * import IconSvg from './components/AIcon';
 */
export default defineComponent({
    props: {
        name: {
            type: String as PropType<string>,
            required: true
        },
        size: {
            type: String as PropType<string | number>,
            default: '1em'
        },
        color: {
            type: String as PropType<string>,
            default: 'inherit'
        }
    },
    emits: ['click'],
    setup(props: any, { emit }: any) {
        const { color, name, size } = props
        const styles = ref({ width: size, height: size, verticalAlign: 'middle',marginBottom:'2px' })
        const symbolId = computed(() => `#icon-${name}`);
        const handleClick = () => {
            emit('click', symbolId.value)
        }
        return () => (
            <svg aria-hidden={true} class="svg-icon" style={styles.value} onClick={handleClick}>
                <use xlinkHref={symbolId.value} fill={color} />
            </svg>
        )
    }
})