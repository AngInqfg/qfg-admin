<template>
    <div class="row">
        <el-card class="row_card flex10">
            <template #header>音乐</template>
            <div class="music">
                <div class="name">{{ pageStore.blogData?.music?.name }}</div>
                <div class="time">
                    <span style="display: inline-block;width: 3em;text-align: center;" v-show="isEditCurrentTime">
                        <el-input ref="editCurrentInputRef" v-model.number="editCurrentAudioTimeNum"
                            @keydown="handleCurrentAudioEnterDown" />
                    </span>
                    <span style="display: inline-block;width: 3em;text-align: center;" v-show="!isEditCurrentTime"
                        @click.stop="handleOpenEditCurrentTimeInput">{{
                            currentAudioTime || '00:00'
                        }}</span>
                    /
                    <span style="display: inline-block;width: 3em;text-align: center;">{{ allAudioTime || '00:00'
                        }}</span>
                </div>
                <div class="oper">
                    <el-button v-if="isPlay" @click="isPlay = false" text type="primary">暂停</el-button>
                    <el-button v-else text @click="isPlay = true" type="primary">播放</el-button>
                </div>
                <div class="volume" style="display: flex;align-items: center">
                    <div style="display: flex;align-items: center;gap: 12px;">
                        <span>{{ Math.floor(volume * 100) > 9 ? Math.floor(volume * 100) : '0' + Math.floor(volume *
                            100)
                            }}</span>
                        <el-slider :disabled="!isVolume" style="width: 100px;" v-model="volume" :min="0" :max="1"
                            :step="0.01" />
                    </div>
                    <el-button v-if="isVolume" @click="isVolume = false" text type="primary">静音</el-button>
                    <el-button v-if="!isVolume" text @click="isVolume = true" type="primary">开放</el-button>
                </div>
                <audio class="audio" controls :volume="volume" :muted="!isVolume" ref="audioRef"
                    @canplay="handleMusicCanplay">
                    <source :src="pageStore.blogData?.music?.url">
                </audio>
            </div>
        </el-card>
        <el-card class="row_card ">
            <template #header>个人</template>
            <div class="flex-row">
                <div>
                    <el-image style="width: 100px; height: 100px;" :src="pageStore.blogData?.avatar" :zoom-rate="1.2"
                        :max-scale="7" :min-scale="0.2" :preview-src-list="[pageStore.blogData?.avatar]" show-progress
                        :initial-index="0" fit="cover" />
                </div>
                <div class="name_val">
                    <div>{{ pageStore.blogData?.name }}（{{ pageStore.blogData?.qqName }}，{{ pageStore.blogData?.wxName
                        }}）</div>
                    <div>{{ pageStore.blogData?.city }}</div>
                    <div>{{ currentTime }}</div>
                </div>
            </div>
        </el-card>
        <el-card class="row_card">
            <template #header>信息</template>
            <div class="name_val">
                <div>名称：{{ pageStore.blogData?.name }}</div>
                <div>经验：{{ exp }}</div>
                <div>教育：{{ pageStore.blogData?.school?.schoolName }}</div>
                <div>
                    {{ pageStore.blogData?.school?.schoolStartDay }}
                    -
                    {{ pageStore.blogData?.school?.schoolEndDay }}
                </div>
            </div>
        </el-card>
        <el-card class="row_card">
            <template #header>公司</template>
            <div class="name_val">
                <div v-for="item in pageStore.blogData?.company">
                    <div>{{ item?.name }} / {{ item?.position }}</div>
                    <div>{{ item?.startTime }}~{{ item?.endTime ? item?.endTime : '至今' }}</div>
                </div>
            </div>
        </el-card>
        <el-card class="row_card flex5">
            <template #header>技能</template>
            <div class="name_val">
                <div v-for="item in pageStore.blogData?.skill">
                    {{ item }}
                </div>
            </div>
        </el-card>
        <el-card class="row_card flex3">
            <template #header>描述</template>
            <div class="name_val">
                <div v-for="item in pageStore.blogData?.describe">
                    {{ item }}
                </div>
            </div>
        </el-card>
        <el-card class="row_card flex2">
            <template #header>通讯</template>
            <div class="flex-row">
                <div class="name_val">
                    <el-image style="width: 100px; height: 100px;" :src="pageStore.blogData?.qqCode" :zoom-rate="1.2"
                        :max-scale="7" :min-scale="0.2"
                        :preview-src-list="[pageStore.blogData?.qqCode, pageStore.blogData?.wxCode]" show-progress
                        :initial-index="0" fit="cover" />
                    <el-image style="width: 100px; height: 100px;" :src="pageStore.blogData?.wxCode" :zoom-rate="1.2"
                        :max-scale="7" :min-scale="0.2"
                        :preview-src-list="[pageStore.blogData?.qqCode, pageStore.blogData?.wxCode]" show-progress
                        :initial-index="1" fit="cover" />
                </div>
                <div class="name_val" style="height: 100%; justify-content: space-between;">
                    <div>QQ: {{ pageStore.blogData?.qq }}</div>
                    <div>微信: {{ pageStore.blogData?.wx }}</div>
                    <div>电话: {{ pageStore.blogData?.phone }}</div>
                    <div>邮箱: {{ pageStore.blogData?.email }}</div>
                </div>
            </div>
        </el-card>
        <el-card class="row_card flex5">
            <template #header>文件</template>
            <div>
                {{ pageStore.blogData?.biographicalNotesPdfDownloadName }}：
                <a :download="pageStore.blogData?.biographicalNotesPdfDownloadName"
                    :href="pageStore.blogData?.biographicalNotesPdfDownloadUrl"> {{
                        pageStore.blogData?.biographicalNotesPdfDownloadUrl }} </a>
            </div>
            <div>
                {{ pageStore.blogData?.biographicalNotesPngDownloadName }}：
                <a :download="pageStore.blogData?.biographicalNotesPngDownloadName"
                    :href="pageStore.blogData?.biographicalNotesPngDownloadUrl"> {{
                        pageStore.blogData?.biographicalNotesPngDownloadUrl }} </a>
            </div>
            <div>
                {{ pageStore.blogData?.biographicalNotesWorkDownloadName }}：
                <a :download="pageStore.blogData?.biographicalNotesWorkDownloadName"
                    :href="pageStore.blogData?.biographicalNotesWorkDownloadUrl"> {{
                        pageStore.blogData?.biographicalNotesWorkDownloadUrl }} </a>
            </div>
        </el-card>
        <el-card class="row_card flex5">
            <template #header>DEMO</template>
            <div class="name_val">
                <div>
                    ELEMENT应用程序：
                    <a target="_blank" :href="pageStore.blogData?.demoElectronUrl"> {{
                        pageStore.blogData?.demoElectronUrl }} </a>
                </div>
                <div>
                    IONICApp：
                    <a target="_blank" :href="pageStore.blogData?.demoAppUrl"> {{
                        pageStore.blogData?.demoAppUrl }} </a>
                </div>
                <div>
                    NUXT3WEB：
                    <a target="_blank" :href="pageStore.blogData?.demoCurrentUrl"> {{
                        pageStore.blogData?.demoCurrentUrl }} </a>
                </div>
                <div>
                    管理系统WEB：
                    <a target="_blank" :href="pageStore.blogData?.currentUrl"> {{
                        pageStore.blogData?.currentUrl }} </a>
                </div>
                <div>
                    小程序：
                    <el-image style="width: 100px; height: 100px;" :src="pageStore.blogData?.demoWxXcxUrl"
                        :zoom-rate="1.2" :max-scale="7" :min-scale="0.2"
                        :preview-src-list="[pageStore.blogData?.demoWxXcxUrl]" show-progress :initial-index="0"
                        fit="cover" />
                </div>
            </div>
        </el-card>
    </div>
</template>
<script setup lang="ts">
import { usePageStore } from '@/stores/page';
import { getDiffYear } from '@/utils'
import Dayjs from 'dayjs';
const pageStore = usePageStore()
const currentTime = shallowRef('')
const exp = computed(() => {
    const days = getDiffYear(pageStore.blogData?.experience)
    return `${days.y}年${days.m}月`
})
const animate = () => {
    currentTime.value = Dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss')
    requestAnimationFrame(animate)
}
requestAnimationFrame(animate)
const audioRef = ref()
const currentAudioTime = ref('')
const currentAudioTimeNum = ref()
const editCurrentAudioTimeNum = ref()
const allAudioTime = ref('')
const isPlay = ref(false)
const isEditCurrentTime = ref(false)
const editCurrentInputRef = ref()
const isVolume = ref(true)
const volume = ref(0.2)
const handleMusicCanplay = (e) => {
    let minutes = Math.floor(e.target.duration / 60);
    let seconds = Math.floor(e.target.duration % 60);
    allAudioTime.value = `${minutes > 9 ? minutes : '0' + minutes}: ${seconds > 9 ? seconds : '0' + seconds}`
}
const handleOpenEditCurrentTimeInput = () => {
    isEditCurrentTime.value = true
    nextTick(() => {
        editCurrentAudioTimeNum.value = currentAudioTimeNum.value
        editCurrentInputRef.value.focus()
    })
}
const handleCurrentAudioEnterDown = (e) => {
    if (e.key === 'Enter') {
        let minutes = Math.floor(editCurrentAudioTimeNum.value / 60);
        let seconds = Math.floor(editCurrentAudioTimeNum.value % 60);
        currentAudioTime.value = `${minutes > 9 ? minutes : '0' + minutes}: ${seconds > 9 ? seconds : '0' + seconds}`
        isEditCurrentTime.value = false
        audioRef.value.currentTime = editCurrentAudioTimeNum.value || 0
    }
}
watch(() => isPlay.value, (_new) => {
    if (isPlay.value) {
        audioRef.value.play()
        audioRef.value.currentTime = currentAudioTimeNum.value || 0
    } else {
        audioRef.value.pause()
    }
})
onMounted(() => {
    pageStore.getBlogData()
    nextTick(() => {
        window.addEventListener('click', () => { 
            if(isEditCurrentTime.value) {
                isEditCurrentTime.value = false
            }
         })
        audioRef.value.addEventListener('timeupdate', function () {
            let currentTime = audioRef.value.currentTime;
            currentAudioTimeNum.value = currentTime
            let minutes = Math.floor(currentTime / 60);
            let seconds = Math.floor(currentTime % 60);
            currentAudioTime.value = `${minutes > 9 ? minutes : '0' + minutes}: ${seconds > 9 ? seconds : '0' + seconds}`
        });
        audioRef.value.addEventListener('play', function () { isPlay.value = true });
        audioRef.value.addEventListener('pause', function () { isPlay.value = false });
        audioRef.value.addEventListener('ended', function () {
            audioRef.value.currentTime = 0
            isPlay.value = false
        });
    })
})
</script>
<style scope lang="scss">
.row {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    gap: 20px;

    &_card {
        flex: 1;
        min-width: 500px;
    }

    .music {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .audio {
        position: absolute;
        top: 0;
        left: 0;
        pointer-events: none;
        opacity: 0;
        user-select: none;
        z-index: -99999;
    }

    .flex10 {
        min-width: 100%;
    }

    .flex5 {
        width: calc(50% - 40px);
    }

    .flex3 {
        width: calc(30% - 40px);
    }

    .flex2 {
        width: calc(20% - 40px);
    }

    .flex-row {
        display: flex;

    }

    .name_val {
        display: flex;
        flex-flow: column;
        justify-content: center;
        gap: 12px;
        margin-left: 12px;
    }
}
</style>