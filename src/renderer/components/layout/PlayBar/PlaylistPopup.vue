<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="show" :class="$style.overlay" @click="$emit('update:show', false)"></div>
        </Transition>
        <Transition enter-active-class="animated slideInRight" leave-active-class="animated fadeOut"
            @after-enter="handleAfterEnter">
            <div v-if="show" :class="$style.popup" :style="popupStyles" @click.stop>
                <div :class="$style.header">
                    <h3 :class="$style.title">播放列表 <span :class="$style.count">{{ playQueue.length }}</span>
                    </h3>
                </div>

                <VirtualizedList ref="listRef" :list="playQueue" :item-height="52" key-name="_key" :class="$style.list">
                    <template #default="{ item, index }: { item: any, index: number }">
                        <div :class="[$style.song, { [$style.active]: isCurrentPlaying(index) }]"
                            @dblclick="handlePlaySong(index)">
                            <div :class="$style.cover">
                                <img v-if="(item.musicInfo as any)?.meta?.picUrl || (item.musicInfo as any)?.meta?.albumImg"
                                    :src="resizeImage((item.musicInfo as any)?.meta?.picUrl || (item.musicInfo as any)?.meta?.albumImg || '', 64)"
                                    alt="cover" loading="lazy" />
                                <img v-else src="./../../../assets/images/default_cover.jpg" alt="cover" />
                                <div :class="$style.coverOverlay" @click.stop="handleTogglePlay(item, index)">
                                    <PhPause v-if="isCurrentPlaying(index) && isPlay" :size="18" weight="fill" />
                                    <PhPlay v-else :size="18" weight="fill" />
                                </div>
                            </div>

                            <div :class="$style.info">
                                <div :class="$style.name">{{ (item.musicInfo as any)?.name || '未知歌曲' }}</div>
                                <div :class="$style.singer">{{ (item.musicInfo as any)?.singer || '未知歌手' }}</div>
                            </div>

                            <div :class="$style.actions">
                                <button :class="$style.actionBtn" :title="isFavorite(item) ? '取消收藏' : '收藏'"
                                    @click.stop="handleFavorite(item)">
                                    <PhHeart :size="16" :weight="isFavorite(item) ? 'fill' : 'regular'" />
                                </button>

                                <button title="从播放列表移除" :class="$style.actionBtn" @click.stop="handleRemove(index)">
                                    <PhTrash :size="16" weight="regular" />
                                </button>
                            </div>
                        </div>
                    </template>
                </VirtualizedList>

                <div v-if="playQueue.length === 0" :class="$style.empty">
                    待播放列表为空
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, nextTick } from 'vue'
import { PhHeart, PhTrash, PhPlay, PhPause } from '@phosphor-icons/vue'
import { tempPlayList, playInfo, playMusicInfo, skippedList, isPlay } from '@renderer/store/player/state'
import { resizeImage } from '@renderer/utils/resizeCover'
import { playList as playListAction, resetRandomNextMusicInfo, playNext, togglePlay } from '@renderer/core/player/action'
import { getList, removeTempPlayList } from '@renderer/store/player/action'
import { appSetting } from '@renderer/store/setting'
import { listUpdateTimes } from '@renderer/store/list/state'
import VirtualizedList from '@renderer/components/base/VirtualizedList.vue'

const props = withDefaults(defineProps<{
    show: boolean
    position?: {
        top?: string
        right?: string
        bottom?: string
        left?: string
    }
}>(), {
    position: () => ({ right: '20px', bottom: '80px' }),
})

const emit = defineEmits<{
    'update:show': [value: boolean]
}>()

const popupStyles = computed(() => ({
    ...props.position,
}))

// 列表容器引用
const listRef = ref<any>(null)

const handleAfterEnter = () => {
    nextTick(() => {
        if (listRef.value) {
            console.log('PlaylistPopup handleAfterEnter, clientHeight:', listRef.value.$el.clientHeight)
            listRef.value.refresh()
            // 只在随机模式下才自动滚动
            const playMode = appSetting['player.togglePlayMethod']
            if (playMode === 'random') {
                // 查找当前播放歌曲的索引
                const currentIndex = playQueue.value.findIndex((item: any) =>
                    item.musicInfo.id === currentPlaylist.value[playInfo.playerPlayIndex]?.id,
                )

                if (currentIndex >= 0) {
                    // 滚动到当前歌曲，使其在视图中居中
                    listRef.value.scrollToIndex(currentIndex, 0, true)
                }
            } else {
                // 非随机模式，滚动到顶部
                listRef.value.scrollTo(0)
            }
        }
    })
}

// 获取当前播放列表
const currentPlaylist = computed(() => {
    if (!playInfo.playerListId) return []
    // 依赖 listUpdateTimes 触发更新
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    listUpdateTimes[playInfo.playerListId]
    return getList(playInfo.playerListId)
})

// 构建待播放队列
const playQueue = computed(() => {
    const queue: Array<LX.Player.PlayMusicInfo & { _key: string }> = []

    // 1. 添加稍后播放列表
    tempPlayList.forEach((item: any, index: number) => {
        queue.push({
            ...item,
            _key: `temp_${item.musicInfo.id}_${index}`,
        })
    })

    // 2. 根据播放模式添加当前播放列表的歌曲
    const currentList = currentPlaylist.value
    if (currentList.length && playInfo.playerListId) {
        const playMode = appSetting['player.togglePlayMethod']

        if (playMode === 'random') {
            // 随机模式：显示完整播放列表（所有歌曲）
            currentList.forEach((music: any, index: number) => {
                if (!skippedList.has(music.id)) {
                    queue.push({
                        musicInfo: music,
                        listId: playInfo.playerListId!,
                        isTempPlay: false,
                        _key: `random_${music.id}_${index}`,
                    })
                }
            })
        } else {
            // 顺序播放模式：显示从下一首开始的歌曲
            const currentIndex = playInfo.playerPlayIndex

            // 从当前播放位置的下一首开始
            for (let i = currentIndex + 1; i < currentList.length; i++) {
                if (!skippedList.has(currentList[i].id)) {
                    queue.push({
                        musicInfo: currentList[i],
                        listId: playInfo.playerListId,
                        isTempPlay: false,
                        _key: `seq_${currentList[i].id}_${i}`,
                    })
                }
            }

            // 如果是列表循环模式，添加从头开始到当前歌曲的部分
            if (playMode === 'listLoop') {
                for (let i = 0; i <= currentIndex; i++) {
                    if (!skippedList.has(currentList[i].id)) {
                        queue.push({
                            musicInfo: currentList[i],
                            listId: playInfo.playerListId,
                            isTempPlay: false,
                            _key: `loop_${currentList[i].id}_${i}`,
                        })
                    }
                }
            }
        }
    }

    return queue
})

const isCurrentPlaying = (index: number) => {
    // 检查是否是当前播放的歌曲
    if (index < tempPlayList.length) return false

    const queueItem = playQueue.value[index]
    const currentMusic = currentPlaylist.value[playInfo.playerPlayIndex]

    return queueItem?.musicInfo?.id === currentMusic?.id
}

const isFavorite = (item: LX.Player.PlayMusicInfo) => {
    // TODO: 实现收藏状态检查
    return false
}

const handlePlaySong = (index: number) => {
    if (index < tempPlayList.length) {
        // 播放稍后播放列表中的歌曲
        // TODO: 实现播放稍后播放列表的逻辑
        console.log('Play song from temp list:', index)
    } else {
        // 播放当前列表中的歌曲
        const queueItem = playQueue.value[index]
        const listIndex = currentPlaylist.value.findIndex(m => m.id === queueItem.musicInfo.id)

        if (playInfo.playerListId && listIndex >= 0) {
            playListAction(playInfo.playerListId, listIndex)
            emit('update:show', false)
        }
    }
}

const handleTogglePlay = (item: LX.Player.PlayMusicInfo, index: number) => {
    if (isCurrentPlaying(index)) {
        togglePlay()
    } else {
        handlePlaySong(index)
    }
}

const handleFavorite = (item: LX.Player.PlayMusicInfo) => {
    const musicInfo = item.musicInfo as any
    if (!musicInfo?.id) return

    // TODO: 实现收藏/取消收藏功能
    console.log('Toggle favorite:', musicInfo.name)
}

const handleRemove = (index: number) => {
    if (index < tempPlayList.length) {
        // 从稍后播放列表移除（物理移除）
        removeTempPlayList(index)
    } else {
        // 从当前播放列表移除
        const queueItem = playQueue.value[index]
        if (queueItem.musicInfo?.id) {
            // 1. 加入跳过列表（核心修复：不仅UI隐藏，底层播放逻辑也会过滤它）
            skippedList.add(queueItem.musicInfo.id)

            // 2. 清除预加载的下一首
            resetRandomNextMusicInfo()

            // 3. 处理播放逻辑：如果移除的是当前正在播放的歌曲，切下一首
            if (playMusicInfo.musicInfo?.id === queueItem.musicInfo.id) {
                playNext()
            }
        }
    }
}

</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 9999;
    backdrop-filter: blur(4px);
}

.popup {
    position: fixed;
    width: 340px;
    height: 600px;
    background: var(--color-main-background);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 10000;
}

.header {
    padding: @gap-sm 12px;
    background-color: var(--color-top-background);
    backdrop-filter: saturate(180%) blur(20px);
    flex: none;

    .title {
        font-size: 18px;
        font-weight: 700;
        position: relative;
        color: var(--color-font);
        display: inline-block;
    }

    .count {
        font-size: 12px;
        opacity: 0.6;
        color: var(--color-font);
        margin-left: 6px;
        font-weight: 500;
        position: absolute;
        right: -18px;
        top: -4px;
        font-family: Outfit;
    }
}

.list {
    flex: 1;
    min-height: 0;
    // padding: 0;
    background-color: var(--color-main-background);

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(99, 102, 241, 0.3);
        border-radius: 3px;
    }
}

.song {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    cursor: pointer;
    transition: background 0.15s ease;
    height: 52px;
    box-sizing: border-box;

    &:hover {
        background: var(--color-hover);

        .actions {
            opacity: 1;
        }

        .coverOverlay {
            opacity: 1 !important;
        }
    }

    &.active {
        background: var(--color-hover);

        .name {
            color: var(--color-primary);
        }
    }

    .cover {
        flex-shrink: 0;
        position: relative;
        height: 36px;

        img {
            width: 36px;
            height: 36px;
            object-fit: cover;
            border-radius: 4px;
        }

        .coverOverlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            color: #fff;
            transition: opacity 0.2s;
            border-radius: 4px;
        }
    }

    .info {
        flex: 1;
        margin-left: 12px;
        min-width: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        height: 100%;

        .name {
            font-size: 13px;
            font-weight: 600;
            color: var(--color-font);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .singer {
            font-size: 12px;
            opacity: 0.68;
            color: var(--color-font);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }

    .actions {
        display: flex;
        gap: 8px;
        opacity: 0;
        transition: opacity 0.15s ease;
    }

    .actionBtn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border: none;
        background: transparent;
        color: var(--color-font);
        cursor: pointer;
        border-radius: 6px;
        transition: all 0.15s ease;

        &:hover {
            background: var(--color-primary-background-hover);
            color: var(--color-primary);
        }
    }
}

.empty {
    text-align: center;
    padding: 48px 24px;
    color: var(--color-font-label);
    font-size: 14px;
    opacity: 0.6;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
