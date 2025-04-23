<template>
    <div class="upload_content">
        <template v-if="!readOnly && fileList.length < limit">
            <div class="upload_content_oper" :class="{
                rect: uploadType === 'rect',
                btn: uploadType === 'btn',
            }" @click="handleUploadClick" @dragenter="handleUploadDragEnter" @dragleave="handleUploadDragLeave"
                @dragover="handleUploadDragOver" @drop="handleUploadDrop">
                <slot name="customUploadStyle">
                    {{ uploadType === 'rect' ? '+' : '上传' }}
                </slot>
                <input class="upload_content_oper_file" type="file" ref="fileInputRef" :limit="limit"
                    :multiple="multiple" :accept="acceptStr" @change="handleUploadInputChange">
            </div>
        </template>
        <template v-if="modalOperation.includes('showFileList')">
            <slot name="customFileList" :item="fileList">
                <div class="upload_content_fileList" v-for="(item, idx) in fileList">
                    <slot name="customFileItem" :item="{ data: item, index: idx }">
                        <div class="upload_content_fileList_item"
                            v-if="imgType.some((n) => accept.find((m) => m === n))">
                            <img class="upload_content_fileList_item_img" :src="item?.url">
                        </div>
                        <div class="upload_content_fileList_item other" v-else>
                            <div @click="search(idx)">{{ item?.name || item?.url }}</div>
                            <div v-if="!readOnly" @click="remove(idx)">删除</div>
                        </div>
                    </slot>
                    <div :class="{
                        upload_content_fileList_operation: true,
                        read_only: readOnly
                    }" v-if="modalOperation.includes('hover') && imgType.some((n) => accept.find((m) => m === n))">
                        <slot name="customFileOperation" :item="{ data: item, index: idx }">
                            <div v-if="modalOperation.includes('hoverSearch')" @click="search(idx)">
                                <svg viewBox="0 0 1024 1024" version="1.1" width="14" height="14">
                                    <path
                                        d="M812.8 718.72a433.728 433.728 0 0 0 89.6-267.136C902.4 203.52 704 0 454.4 0S0 203.52 0 451.584s204.8 451.584 454.4 451.584c102.4 0 198.4-31.808 268.8-89.088l192 190.848c12.8 12.736 32 19.072 44.8 19.072 12.8 0 32-6.4 44.8-19.072 25.6-25.472 25.6-63.616 0-89.024l-192-197.184z m-358.4 50.88c-179.2 0-326.4-139.904-326.4-318.08 0-178.048 147.2-324.288 326.4-324.288s326.4 146.24 326.4 324.352c0 178.112-147.2 318.016-326.4 318.016z" />
                                </svg>
                            </div>
                            <div v-if="!readOnly && modalOperation.includes('hoverDelete')" @click="remove(idx)">
                                <svg viewBox="0 0 1024 1024" version="1.1" width="14" height="14">
                                    <path
                                        d="M132.277308 1013.157647a86.799059 86.799059 0 0 1-6.565647-6.625882c2.409412 2.409412 4.397176 4.698353 6.625883 6.625882zM1012.013779 158.900706a43.068235 43.068235 0 0 0-29.997177-12.16753h-210.703058V80.775529A80.715294 80.715294 0 0 0 690.839191 0H331.174249a80.715294 80.715294 0 0 0-80.474353 80.775529v65.957647H38.972838A40.96 40.96 0 0 0 0.000602 187.813647a40.96 40.96 0 0 0 38.972236 40.96h36.080941v714.390588c0 44.574118 36.080941 80.835765 80.414117 80.835765h722.582589a80.715294 80.715294 0 0 0 80.414117-80.835765V228.773647h23.491765a41.984 41.984 0 0 0 42.044235-40.96 40.598588 40.598588 0 0 0-12.047058-28.912941zM331.053779 81.016471h359.424v66.439529H331.053779V81.016471z m546.876235 862.027294H155.407661V228.894118h722.462118v714.209882z m-367.435294-576.632471a40.96 40.96 0 0 0-41.140706 41.261177v382.915764c0 22.768941 18.432 41.261176 41.080471 41.261177a41.200941 41.200941 0 0 0 41.140706-41.261177V407.672471a41.200941 41.200941 0 0 0-41.140706-41.261177z m-222.629647 0a41.200941 41.200941 0 0 0-41.080471 41.261177v382.915764c0 22.768941 18.432 41.261176 41.080471 41.261177a41.200941 41.200941 0 0 0 41.140706-41.261177V407.672471a41.200941 41.200941 0 0 0-41.140706-41.261177z m442.910118 0a41.200941 41.200941 0 0 0-41.140706 41.261177v382.915764a41.200941 41.200941 0 0 0 82.160941 0V407.672471a41.200941 41.200941 0 0 0-41.020235-41.261177z" />
                                </svg>
                            </div>
                            <div v-if="!readOnly && modalOperation.includes('hoverDownload')" @click="downLoad(idx)">
                                <svg viewBox="0 0 1024 1024" version="1.1" width="18" height="18">
                                    <path
                                        d="M160 832h704c9.344 0 17.024 3.008 23.04 8.96 5.952 6.016 8.96 13.696 8.96 23.04a31.168 31.168 0 0 1-8.96 23.04 31.168 31.168 0 0 1-23.04 8.96h-704a31.168 31.168 0 0 1-23.04-8.96 31.168 31.168 0 0 1-8.96-23.04c0-9.344 3.008-17.024 8.96-23.04A31.168 31.168 0 0 1 160 832z m384-254.016l236.032-235.968 45.952 44.992L508.992 704 192.128 387.008l44.992-44.992L480 585.024v-456.96h64v449.984z" />
                                </svg>
                            </div>
                            <div v-if="!readOnly && modalOperation.includes('hoverDetail')" @click="detail(idx)">
                                <svg viewBox="0 0 1024 1024" version="1.1" width="16" height="16">
                                    <path
                                        d="M512 1024c-281.6 0-512-230.4-512-512s230.4-512 512-512 512 230.4 512 512-230.4 512-512 512z m0-938.666667c-234.666667 0-426.666667 192-426.666667 426.666667s192 426.666667 426.666667 426.666667 426.666667-192 426.666667-426.666667-192-426.666667-426.666667-426.666667z m0 725.333334c-25.6 0-42.666667-17.066667-42.666667-42.666667v-298.666667c0-25.6 17.066667-42.666667 42.666667-42.666666s42.666667 17.066667 42.666667 42.666666v298.666667c0 21.333333-17.066667 42.666667-42.666667 42.666667z m0-567.466667c25.6 0 46.933333 21.333333 46.933333 46.933333s-21.333333 46.933333-46.933333 46.933334-46.933333-21.333333-46.933333-46.933334 21.333333-46.933333 46.933333-46.933333z" />
                                </svg>
                            </div>
                        </slot>
                    </div>
                </div>
            </slot>
        </template>
        <dialog ref="dialogRef" class="big_content">
            <div class="big_search">
                <div class="big_search_close" @click="close">
                    <svg viewBox="0 0 1024 1024" version="1.1" :width="operSize" :height="operSize">
                        <path
                            d="M274.176 229.696l4.48 3.648L512 466.752l233.344-233.408a32 32 0 0 1 48.96 40.832l-3.648 4.48L557.248 512l233.408 233.344a32 32 0 0 1-40.832 48.96l-4.48-3.648L512 557.248l-233.344 233.408a32 32 0 0 1-48.96-40.832l3.648-4.48L466.752 512 233.344 278.656a32 32 0 0 1 40.832-48.96z" />
                    </svg>
                </div>
                <template v-if="imgType.some((n) => fileList?.[currentIndex]?.type === n)">
                    <template v-if="modalOperation.includes('tab') && fileList.length > 1">
                        <div class="big_search_tab left" @click="tab('left')">
                            <svg viewBox="0 0 1024 1024" version="1.1" :width="operSize" :height="operSize">
                                <path
                                    d="M734.2 945c-17.5 17.5-45.8 17.5-63.3 0L300.7 574.8c-35-35-35-91.7 0-126.6l372.9-373c17.3-17.3 45.3-17.5 62.8-0.5 17.9 17.4 18.1 46.1 0.5 63.8L395.7 479.8c-17.5 17.5-17.5 45.8 0 63.3l338.6 338.6c17.4 17.5 17.4 45.8-0.1 63.3z" />
                            </svg>
                        </div>
                        <div class="big_search_tab right" @click="tab('right')">
                            <svg viewBox="0 0 1024 1024" version="1.1" :width="operSize" :height="operSize">
                                <path
                                    d="M290.3 945c17.5 17.5 45.8 17.5 63.3 0l370.2-370.2c35-35 35-91.7 0-126.6l-372.9-373c-17.3-17.3-45.3-17.5-62.8-0.5-17.9 17.4-18.1 46.1-0.5 63.8l341.3 341.3c17.5 17.5 17.5 45.8 0 63.3L290.3 881.7c-17.5 17.5-17.5 45.8 0 63.3z" />
                            </svg>
                        </div>
                    </template>
                    <div class="big_search_other" v-if="modalOperation.includes('showOperation')">
                        <div class="page" v-if="modalOperation.includes('page')">{{ currentIndex + 1 }} / {{
                            fileList.length }}
                        </div>
                        <svg class="scale1" v-if="modalOperation.includes('scale')" viewBox="0 0 1024 1024"
                            version="1.1" :width="operSize" :height="operSize" @click="handleScale(100, 0.1)">
                            <path
                                d="M288 480h304v-80H288v80z m409.152 161.84c100.56-128.16 92.72-314.16-26.32-433.216C463.728 1.488 111.536 151.136 111.536 440.32c0 274.112 316.24 425.024 529.216 257.968l211.12 211.104 56.416-56.416-211.136-211.12zM263.92 615.52C109.312 460.96 217.472 192.48 439.168 192.48c136.96 0 247.84 110.848 247.84 247.824 0 218.272-266.08 332.256-423.088 175.232z" />
                        </svg>
                        <svg class="scale2" v-if="modalOperation.includes('scale')" viewBox="0 0 1024 1024"
                            version="1.1" :width="operSize" :height="operSize" @click="handleScale(-100, 0.1)">
                            <path
                                d="M480 288h-80v112h-112v80h112v112h80v-112h112v-80h-112v-112z m216.592 353.504c100.72-128.384 92.032-313.808-26.24-432.064-127.648-127.68-334.4-127.728-462.08 0-127.68 127.632-127.792 334.368-0.016 462.08 118.56 118.56 304.064 126.672 432.096 26.24l210.56 210.56 56.256-56.272-210.576-210.56z m-257.28 46.128c-136.608 0-247.2-110.496-247.2-247.136s110.56-247.2 247.2-247.2 247.168 110.56 247.168 247.184c0 136.64-110.56 247.152-247.168 247.152z" />
                        </svg>
                        <svg class="full" v-if="modalOperation.includes('full')" viewBox="0 0 1024 1024" version="1.1"
                            :width="operSize" :height="operSize" @click="handleFull">
                            <path v-if="bigImageOper?.full"
                                d="M832 128a64 64 0 0 1 64 64v640a64 64 0 0 1-64 64H192a64 64 0 0 1-64-64V192a64 64 0 0 1 64-64h640z m0 64H192v640h640V192zM352 328a32 32 0 0 1 32 32v304a32 32 0 1 1-64 0v-304a32 32 0 0 1 32-32z m320 0a32 32 0 0 1 32 32v304a32 32 0 1 1-64 0v-304a32 32 0 0 1 32-32zM512 576a32 32 0 1 1 0 64 32 32 0 0 1 0-64z m0-192a32 32 0 1 1 0 64 32 32 0 0 1 0-64z" />
                            <path v-else
                                d="M832 128a64 64 0 0 1 64 64v640a64 64 0 0 1-64 64H192a64 64 0 0 1-64-64V192a64 64 0 0 1 64-64h640z m0 64H192v640h640V192zM287.872 576a32 32 0 0 1 31.808 32V704h96.448a32 32 0 0 1 31.872 32 32 32 0 0 1-31.872 32.064H319.68A63.872 63.872 0 0 1 256 703.936V608A32 32 0 0 1 287.872 576z m415.872-320C739.2 256 768 284.8 768 320.192v95.68a32.128 32.128 0 0 1-64.256 0V320.192H608.128a32.128 32.128 0 1 1 0-64.192h95.616z" />
                        </svg>
                        <svg class="rotate1" v-if="modalOperation.includes('rotate')" viewBox="0 0 1024 1024"
                            version="1.1" :width="operSize" :height="operSize" @click="handleRotate(-90)">
                            <path
                                d="M263.024 239.456c-25.12 25.104-71.152 66.704-103.152 103.648v-150.592H80v287.36h287.936v-79.488h-152.192c116.352-111.936 183.728-207.968 336.112-207.968 172.096 0 312.112 139.84 312.112 311.76 0 171.936-140 311.888-312.112 311.888-158.496 0-289.152-111.84-308.912-271.76h-80.96C182.096 736.192 349.136 896 551.84 896 768.08 896 944 720.208 944 504.192c0-331.84-405.68-539.792-680.976-264.736z" />
                        </svg>
                        <svg class="rotate2" v-if="modalOperation.includes('rotate')" viewBox="0 0 1024 1024"
                            version="1.1" :width="operSize" :height="operSize" @click="handleRotate(90)">
                            <path
                                d="M656 480h288V192h-80v150.88c-36.64-36.96-78-78.64-103.104-103.744C674.144 152.384 582.352 112 472 112 255.84 112 80 287.84 80 504S255.84 896 472 896c202.624 0 369.616-154.592 389.728-352h-80.704c-19.696 153.152-150.56 272-309.024 272C299.968 816 160 676.032 160 504S299.968 192 472 192c88.96 0 160.592 31.984 232.32 103.696C729.6 320.96 771.248 362.928 808 400H656v80z" />
                        </svg>
                        <svg class="download" v-if="modalOperation.includes('download')" viewBox="0 0 1024 1024"
                            version="1.1" :width="operSize" :height="operSize" @click="downLoad(currentIndex)">
                            <path
                                d="M160 832h704c9.344 0 17.024 3.008 23.04 8.96 5.952 6.016 8.96 13.696 8.96 23.04a31.168 31.168 0 0 1-8.96 23.04 31.168 31.168 0 0 1-23.04 8.96h-704a31.168 31.168 0 0 1-23.04-8.96 31.168 31.168 0 0 1-8.96-23.04c0-9.344 3.008-17.024 8.96-23.04A31.168 31.168 0 0 1 160 832z m384-254.016l236.032-235.968 45.952 44.992L508.992 704 192.128 387.008l44.992-44.992L480 585.024v-456.96h64v449.984z" />
                        </svg>
                        <svg class="delete" v-if="modalOperation.includes('delete') && !readOnly"
                            viewBox="0 0 1024 1024" version="1.1" :width="operSize" :height="operSize"
                            @click="remove(currentIndex)">
                            <path
                                d="M768 960H256a64 64 0 0 1-64-64V256H128V192h224V115.2a51.2 51.2 0 0 1 51.2-51.2h217.6a51.2 51.2 0 0 1 51.2 51.2V192H896v64h-64v640a64 64 0 0 1-64 64zM256 256v640h512V256z m160-128v64h192V128zM640 768H576V384h64v384z m-192 0H384V384h64v384z" />
                        </svg>
                    </div>
                    <div class="big_search_value" ref="bigImageRef">
                        <img :src="fileList?.[currentIndex]?.url" ref="bigImageValueRef">
                    </div>
                </template>
                <template v-if="audioType.some((n) => fileList?.[currentIndex]?.type === n)">
                    <audio controls :volume="0.3">
                        <source :src="fileList?.[currentIndex]?.url">
                    </audio>
                </template>
                <template v-if="videoType.some((n) => fileList?.[currentIndex]?.type === n)">
                    <video controls :volume="0.3">
                        <source :src="fileList?.[currentIndex]?.url">
                    </video>
                </template>
            </div>
        </dialog>
        <dialog ref="dragRef" class="big_content drag_content">
            <div class="drag_content_box" @click="() => handleVisibleDragModal(false)">
                <div class="drag_content_box_val" @dragenter="handleUploadDragEnter" @dragleave="handleUploadDragLeave"
                    @dragover="handleUploadDragOver" @drop="handleUploadDrop">
                    <div class="drag_content_box_val_content" @click.stop="handleDragClick">
                        <div>
                            <svg viewBox="0 0 1024 1024" version="1.1" width="70" height="70">
                                <path
                                    d="M767.9 441c-24.2-121.3-128-214-255.9-214-100.3 0-186.7 57.1-228.2 142.7C176.5 383.9 97 473.1 97 583.7c0 117.7 93.4 213.9 207.5 213.9H754c96.8 0 172.9-78.5 172.9-178.3 0.1-92.7-72.5-171.2-159-178.3zM581.2 542.3V672c0 7.2-5.8 13-13 13H455.8c-7.2 0-13-5.8-13-13V542.3h-73.1c-11.5 0-17.3-13.8-9.3-22l142.3-146.7c5.1-5.3 13.5-5.3 18.6 0l142.3 146.7c8 8.2 2.1 22-9.3 22h-73.1z" />
                            </svg>
                        </div>
                        <div>
                            拖拽文件到窗口或<span>点击窗口</span>进行上传
                        </div>
                    </div>
                </div>
            </div>
        </dialog>
    </div>
</template>

<script setup>
import { useId, computed, useTemplateRef, ref } from 'vue'
import useMoveEl from '../../utils/useMoveEl.ts'
const imgType = ['png', 'jpeg', 'jpg', 'PNG', 'JPEG', 'JPG']
const audioType = ['mp3', 'MP3', 'mpeg']
const videoType = ['mp4', 'MP4', 'mu3c']
const operSize = 24
const props = defineProps({
    uploadType: {
        type: String,
        default: 'rect'
    },
    // 只读
    readOnly: {
        type: Boolean,
        default: false
    },
    // 上限
    limit: {
        type: Number,
        default: 3
    },
    // 单个文件大小
    size: {
        type: Number,
        default: 20
    },
    // 多选
    multiple: {
        type: Boolean,
        default: true
    },
    // 类型
    accept: {
        type: Array,
        default: () => ['png', 'jpeg', 'jpg', 'PNG', 'JPEG', 'JPG', 'text', 'txt']
    },
    // 上传地址
    httpUrl: {
        type: String,
        default: ''
    },
    httpHeader: {
        type: Object,
        default: () => ({
            'Content-Type': 'multipart/form-data'
        })
    },
    // 自动上传
    autoUpload: {
        type: Boolean,
        default: true
    },
    // 文件列表 [{url, type, name}]
    fileList: {
        type: Array,
        default: () => []
    },
    // return false会停止后边操作
    uploadBefore: {
        type: Function,
        default: () => true
    },
    // 是否显示拖拽弹窗
    showIsDragDialog: {
        type: Boolean,
        default: false
    },
    // 大图背景
    modalBackground: {
        type: String,
        default: 'rgba(0,0,0, 0.5)'
    },
    // 操作栏showFileList显示文件列表 hover悬浮图片操作 showOperation现在图片操作 tab切换键 page个数 scale放大按钮 wheelScale鼠标放大 full视口按钮 rotate旋转按钮 download下载 delete删除
    modalOperationList: {
        type: Array,
        default: () => ['showFileList', 'hover', 'hoverSearch', 'hoverDelete', 'hoverDownload', 'hoverDetail', 'showOperation', 'tab', 'page', 'scale', 'wheelScale', 'full', 'rotate', 'download', 'delete']
    },
    // 操作栏过滤
    modalOperationExclude: {
        type: Array,
        default: () => []
    },
    // 放大缩小限制
    scaleObject: {
        type: Object,
        default: () => ({ max: 1.5, min: 0.5, default: 1 })
    },
    loading: {
        type: Boolean,
        default: false
    }
})
// customUpload自定义上传  props.autoUpload=false时候 触发
// deleteChange删除 触发
// downloadChange下载 触发
// detailChange详情 触发
// errorChange: multiple多选， limit总数，accept每个文件类型，size每个文件大小
const emits = defineEmits(['update:fileList', 'update:loading', 'customUpload', 'errorChange', 'deleteChange', 'detailChange', 'downloadChange'])
const fileInputEl = useTemplateRef('fileInputRef')
const dragDialogEl = useTemplateRef('dragRef')
const acceptStr = computed(() => props.accept.map((n) => `.${n}, `).join(''))
const scaleDefault = computed(() => props.scaleObject.default)
const modalOperation = computed(() => props.modalOperationList.filter((n) => !props.modalOperationExclude.includes(n)))
/**
 * 文件事件
 */
async function fileChange(files) {
    // 如果上传前是false return出去
    const beforeResult = await props.uploadBefore(files)
    if (!beforeResult) {
        return
    }
    emits('update:loading', true)
    if (!props.multiple) {
        // 单选
        if (files.length > 1) {
            fileInputEl.value.value = ''
            emits('errorChange', { type: 'multiple', currentFile: files, message: '当前为单一上传，请重新选择图片' })
            emits('update:loading', false)
            throw '当前为单一上传，请重新选择图片'
        }
    }
    // 超出最大数限制
    const fileLeng = [...props.fileList, ...files].length
    if (fileLeng > props.limit) {
        fileInputEl.value.value = ''
        emits('errorChange', { type: 'limit', currentFile: files, message: `超出总数${props.limit}限制，全部总数${fileLeng}，fileList总数${props.fileList.length}，选中总数${files.length}，请重新上传` })
        emits('update:loading', false)
        throw `超出总数${props.limit}限制，全部总数${fileLeng}，fileList总数${props.fileList.length}，选中总数${files.length}，请重新上传`
    }
    // 类型错误
    const haveNotAccept = [...files].every((n) => {
        return props.accept.some((m) => n?.type.toLowerCase().indexOf(m.toLowerCase()) > -1)
    })
    if (!haveNotAccept) {
        fileInputEl.value.value = ''
        emits('errorChange', { type: 'accept', currentFile: files, message: '上传的文件类型错误，请重新上传' })
        emits('update:loading', false)
        throw `上传的文件类型错误，请重新上传`
    }
    // 大小错误
    const haveMaxSize = [...files].every((n) => {
        return n.size < props.size * 1024 * 1024
    })
    if (!haveMaxSize) {
        emits('errorChange', { type: 'size', currentFile: files, message: '上传文件超出大小限制，请重新上传' })
        emits('update:loading', false)
        throw `上传文件超出大小限制，请重新上传`
    }
    // 自动上传
    if (!props.autoUpload) {
        emits('customUpload', files)
        return
    }
    const { success, fail } = await httpUpload([...files])
    const eList = [...props.fileList, ...success.map((n) => n.file)]
    emits('update:fileList', eList)
    emits('errorChange', { type: 'httpUploadFile', currentFile: fail })
    fileInputEl.value.value = ''
    emits('update:loading', false)
}
/**
 * 上传
 */
async function httpUpload(list) {
    let arr = []
    let err = []
    for (let i = 0; i < list.length; i++) {
        const item = list[i]
        let formData = new FormData();
        formData.append("file", item);
        try {
            const result = await fetch(props.httpUrl, {
                method: "POST",
                headers: props.httpHeader,
                body: formData
            })
            const res = await result.json()
            if (res) {
                arr = [...arr, { index: i, file: { url: res?.data, name: item?.name, type: item?.type } }]
            }
        } catch {
            err = [...err, { index: i, file: item }]
        }
    }
    return { success: arr, fail: err }
}
/**
 * 事件回调
 */
const handleUploadInputChange = (e) => {
    const files = e.target.files
    fileChange(files)
}
const handleUploadClick = () => {
    if (props.showIsDragDialog) {
        handleVisibleDragModal(true)
        return
    }
    fileInputEl.value.click()
}
const handleDragClick = () => {
    fileInputEl.value.click()
}
const handleUploadDragEnter = (e) => {
    e.preventDefault()
    e.target.classList.add('draging')
}
const handleUploadDragLeave = (e) => {
    e.target.classList.remove('draging')
}
const handleUploadDragOver = (e) => {
    e.preventDefault()
}
const handleUploadDrop = (e) => {
    e.preventDefault()
    e.target.classList.remove('draging')
    const files = e.dataTransfer.files
    fileInputEl.value.files = files
    fileChange(files)
}
/**
 * 弹窗
 */
const currentIndex = ref(0)
const dialogEl = useTemplateRef('dialogRef')
const bigImageEl = useTemplateRef('bigImageRef')
const bigImageValueEl = useTemplateRef('bigImageValueRef')
const bigImageOper = ref({ rotate: 0, scale: scaleDefault.value, full: false, x: 0, y: 0 })
const vminStatus = computed(() => bigImageOper.value?.full ? '100vmin' : '90vmin')
const bigMoveBool = ref(false)
const moveOption = ref({ startX: 0, startY: 0, oldMoveX: 0, oldMoveY: 0 })
// 大图移动
const bigImageMoveCall = (e) => {
    if (bigMoveBool.value) {
        const { startX, startY, oldMoveX, oldMoveY } = moveOption.value
        bigImageOper.value.x = e.clientX - startX + oldMoveX
        bigImageOper.value.y = e.clientY - startY + oldMoveY
        trans()
    }
}
// 大图弹起
const bigImageUpCall = (e) => {
    if (bigMoveBool.value) {
        bigMoveBool.value = false
        moveOption.value.oldMoveX = JSON.parse(JSON.stringify(bigImageOper.value.x))
        moveOption.value.oldMoveY = JSON.parse(JSON.stringify(bigImageOper.value.y))
        window.removeEventListener('mousemove', bigImageMoveCall)
        window.removeEventListener('mouseup', bigImageUpCall)
    }
}
// 大图按下
const bigImageDownCall = (e) => {
    bigMoveBool.value = true
    moveOption.value.startX = e.clientX
    moveOption.value.startY = e.clientY
    window.addEventListener('mousemove', bigImageMoveCall)
    window.addEventListener('mouseup', bigImageUpCall)
}
// 查看大图
function search(i) {
    if (props.fileList.length === 0) return
    currentIndex.value = i
    dialogEl.value.showModal()
    if (imgType.some((n) => props.accept.find((m) => m === n))) {
        let timer = setTimeout(() => {
            window.addEventListener('wheel', handleScale)
            bigImageEl.value.addEventListener('mousedown', bigImageDownCall)
            clearTimeout(timer)
        }, 100);
    }
}
// 关闭大图
async function close() {
    dialogEl.value.close()
    currentIndex.value = 0
    if (imgType.some((n) => props.accept.find((m) => m === n))) {
        window.removeEventListener('wheel', handleScale)
        bigImageEl.value.removeEventListener('mousedown', bigImageDownCall)
        let timer = setTimeout(() => {
            clearOption()
            trans()
            clearTimeout(timer)
        }, 100);
    }
}
// 切换图片
function tab(type) {
    if (type === 'left') {
        currentIndex.value = currentIndex.value === 0 ? props.fileList.length - 1 : currentIndex.value - 1
    } else if (type === 'right') {
        currentIndex.value = currentIndex.value === props.fileList.length - 1 ? 0 : currentIndex.value + 1
    }
    clearOption()
    trans()
}
// 删除图片
async function remove(i) {
    if (dialogEl.value.open) {
        await close()
    }
    const { fileList } = props
    emits('deleteChange', { index: i, data: fileList[i] })
    const rList = fileList.filter((_n, idx) => idx !== i)
    emits('update:fileList', rList)
}
// 下载
async function downLoad(i) {
    const { fileList } = props
    emits('downloadChange', { index: i, data: fileList[i] })
}
// 详情
async function detail(i) {
    const { fileList } = props
    emits('detailChange', { index: i, data: fileList[i] })
}
/**
 * @param e 100|-100 或 {deltaY}鼠标滚动
 * @param num 缩放进度
 */
function handleScale(e, num = 0.05) {
    if (!dialogEl.value.open) return
    if (!modalOperation.value.includes('wheelScale')) {
        if (typeof e !== 'number') {
            return
        }
    }
    const dir = typeof e === 'number' ? e < 0 ? true : false : e?.deltaY < 0 ? true : false
    const { scale } = bigImageOper.value
    if (dir) {
        if (scale >= props.scaleObject.max) return
        bigImageOper.value.scale = scale + num
    } else {
        if (scale <= props.scaleObject.min) return
        bigImageOper.value.scale = scale - num
    }
    trans()
}
// 全屏
function handleFull() {
    clearOption(!bigImageOper.value?.full)
    bigImageOper.value.scale = props?.scaleObject?.default
    trans()
}
// 旋转
function handleRotate(e) {
    clearOption()
    bigImageOper.value.scale = props?.scaleObject?.default
    bigImageOper.value.rotate += e
    if (Math.abs(bigImageOper.value.rotate) === 360) {
        bigImageOper.value.rotate = 0
    }
    trans()
}
function trans() {
    const { x, y, rotate, scale } = bigImageOper.value
    bigImageValueEl.value.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${scale})`
}
function clearOption(e) {
    const n = typeof e === 'undefined' ? false : e
    bigImageOper.value = { rotate: 0, scale: scaleDefault.value, full: n, x: 0, y: 0 }
    moveOption.value = { startX: 0, startY: 0, oldMoveX: 0, oldMoveY: 0 }
}
function handleVisibleDragModal(e) {
    if (!props.showIsDragDialog) {
        return
    }
    e ? dragDialogEl.value?.showModal() : dragDialogEl.value?.close()
}
// handleVisibleDragModal 开启关闭拖拽弹窗

defineExpose({
    handleVisibleDragModal
})
</script>

<style scoped lang="scss">
dialog:modal {
    max-width: 100% !important;
    max-height: 100% !important;
    background: transparent;
}

dialog:-internal-dialog-in-top-layer::backdrop {
    background: transparent;
}

.upload_content {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    $size: 100px;
    $Acolor: #ccc;
    $color: #409eff;
    $gap: 4px;
    gap: $gap;

    &_oper,
    &_fileList {
        width: $size;
        height: $size;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: calc($size / 20);
        position: relative;
    }

    &_oper {
        font-size: 40px;
        color: $Acolor;
        overflow: hidden;
        cursor: pointer;
        border: 1px solid $Acolor;

        &_file {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            user-select: none;
            pointer-events: none;
            cursor: pointer;
        }

        &.draging,
        &:hover {
            color: $color;
            background: lighten($color, 30);
            border-color: $color;
        }

        &.btn {
            width: calc($size - $size / 4);
            height: auto;
            font-size: 14px;
            color: $color;
            border: 1px solid $color;
        }
    }

    &_fileList {
        gap: $gap;

        &_item {
            width: 100%;
            height: 100%;
            border-radius: calc($size / 20);
            overflow: hidden;
            border: 1px solid $Acolor;

            &_img {
                width: 100%;
                height: 100%;
            }

            &.other {
                width: 100%;
                height: auto;
                border: 0;
                display: flex;
                justify-content: flex-start;
                align-items: center;

                >div:first-child {
                    width: auto;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    cursor: pointer;
                }

                >div:last-child {
                    width: 50px;
                    text-align: center;
                    cursor: pointer;

                    &:hover {
                        color: $color;
                    }
                }
            }
        }

        &:has(.other) {
            justify-content: flex-start;
            width: 100%;
            height: auto;
        }

        &_operation {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            background: rgba(0, 0, 0, 0.5);
            display: none;
            grid-template-columns: 1fr 1fr;
            justify-items: end;
            align-content: center;
            gap: 4px;
            color: #ffffff;
            fill: #ffffff;
            stroke: #ffffff;

            &.read_only {
                grid-template-columns: 1fr;
                justify-items: center;
            }

            >div {
                width: 30px;
                height: 30px;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;

                &:nth-child(even) {
                    justify-self: start;
                }

                &:hover {
                    fill: $color;
                }
            }
        }

        &:hover {
            .upload_content_fileList_operation {
                display: grid;
            }
        }
    }

    .big_content {
        width: 100%;
        height: 100%;
        outline: none;
        border: none;
        padding: 0;
        margin: 0;
        user-select: none;
        overflow: hidden;

        .big_search {
            width: 100%;
            height: 100%;
            background-color: v-bind(modalBackground);

            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            $pos: 20px;

            &_value {
                width: v-bind(vminStatus);
                height: v-bind(vminStatus);
                transform: translate(0, 0) rotate(0deg) scale(v-bind(scaleDefault));
                position: relative;
                z-index: 0;

                img {
                    pointer-events: none;
                    width: 100%;
                    height: 100%;
                }
            }

            &_close,
            &_tab,
            &_other {
                position: absolute;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 50%;
                padding: 12px;
                background: rgba(0, 0, 0, 0.5);
                cursor: pointer;
                fill: $Acolor;
                color: $Acolor;
            }

            &_close {
                top: $pos;
                right: $pos;
                z-index: 5;
            }

            &_tab {
                top: 50%;
                transform: translateY(-50%);
                z-index: 4;

                &.left {
                    left: $pos;
                }

                &.right {
                    right: $pos;
                }
            }

            &_other {
                height: 20px;
                border-radius: 50px;
                bottom: calc($pos * 2);
                z-index: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 30px;
                padding-left: 20px;
                padding-right: 20px;
                z-index: 3;
            }
        }
    }

    .drag_content {
        background-color: transparent;

        &_box {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;

            &_val {
                $h: 30px;
                width: 40vw;
                box-shadow: 5px 5px 10px #ddd;
                border: 1px solid #fff;
                border-top-color: #efefef;
                border-left-color: #efefef;
                background: #ffffff;
                fill: #aaa;
                color: #aaa;
                border-radius: 12px;
                cursor: pointer;
                display: flex;
                flex-flow: column;
                overflow: hidden;

                span {
                    color: $color;
                }

                &_content {
                    padding: calc(48px - $h) 12px 48px;
                    flex: 1;

                    >div {
                        pointer-events: none;
                    }

                    &.draging {
                        color: $color;
                        fill: $color;
                    }
                }
            }
        }
    }
}
</style>