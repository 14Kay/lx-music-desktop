<template>
    <div :class="[$style.playlistInfo, { [$style.vertical]: vertical }]" @click.stop="handleClose">
        <common-cover :list-id="listId" :class="$style.cover" :image-url="resizeImage(cover, 400)"
            :play-button-size="playButtonSize" :show-play-button="true" :always-show-shadow="false"
            :click-cover-to-play="false" :fixed-size="200" type="playlist" :is-playing="isPlayingCurrentPlaylist"
            @play="handlePlayPause" />
        <div :class="$style.info">
            <div :class="$style.header">
                <div>
                    <div ref="input_dom">
                        <h3 v-show="!isRename" :class="$style.title">{{ localTitle }}</h3>
                        <base-input v-show="isRename" v-model="localTitle" :class="$style.listsInput" type="text"
                            :value="localTitle" :placeholder="localTitle" @keyup.enter="handleSaveListName"
                            @blur="handleSaveListName" @click.stop />
                    </div>
                    <div :class="$style.author">
                        <p class="my__number">PLAYLIST BY {{ author }} · {{ count }}首歌</p>
                    </div>
                </div>
            </div>
            <div :class="$style.last">
                <div :class="$style.buttons">
                    <div class="my__button" active @click="handlePlayPause">
                        <PhPause v-if="isPlayingCurrentPlaylist" size="45%" weight="fill" />
                        <PhPlay v-else size="45%" weight="fill" />
                    </div>

                    <div v-if="showCollect" class="my__button" @click="emit('collect')">
                        <PhHeart size="45%" :weight="isCollected ? 'fill' : 'regular'" />
                    </div>

                    <div v-if="listId != LIST_IDS.LOVE && listId != LIST_IDS.DEFAULT && !showCollect" class="my__button"
                        @click="emit('delete')">
                        <PhTrash size="45%" />
                    </div>
                    <div class="my__button" @click.stop="showMenu = !showMenu">
                        <PhDotsThree size="45%" weight="bold" />

                        <div :class="[$style.menuContainer, { [$style.show]: showMenu }]">
                            <div v-if="listId != LIST_IDS.LOVE && listId != LIST_IDS.DEFAULT && !showCollect"
                                @click="handleRename">{{ $t('lists__rename') }}</div>
                            <div @click="handleSearch">{{ $t('list__search') }}</div>
                        </div>
                    </div>
                </div>
                <div ref="search_dom" :class="$style.search">
                    <PhMagnifyingGlass size="16" />
                    <input v-model="searchContent" :placeholder="$t('list__search')" type="text"
                        @blur="handleSearchAction" @keyup.enter="handleSearchAction" @click.stop="handleSearchFocus" />
                </div>
            </div>

        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, toRef, watch, computed } from 'vue'
import { LIST_IDS } from '@common/constants'
import useRename from './useRename'
import useSearch from './useSearch'
import { resizeImage } from '@renderer/utils/resizeCover'
import { PhTrash, PhPause, PhPlay, PhDotsThree, PhHeart, PhMagnifyingGlass } from '@phosphor-icons/vue'
import { playMusicInfo, isPlay } from '@renderer/store/player/state'
import { tempListMeta } from '@renderer/store/list/state'
import { pause } from '@renderer/core/player'

const emit = defineEmits(['play', 'collect', 'delete', 'search'])
const showMenu = ref(false)
const isRename = ref(false)
const input_dom = ref<HTMLInputElement | null | undefined>(null)
const search_dom = ref<HTMLInputElement | null>(null)
const searchContent = ref('')
const searchWidth = ref(85)

const props = withDefaults(defineProps<{
    listId: string
    cover: string
    author: string
    playButtonSize?: number
    title: string
    description?: string
    count?: string | number
    createTime?: string
    isCollected?: boolean
    showCollect?: boolean
    vertical?: boolean
}>(), {
    playButtonSize: 22,
    description: '',
    count: 0,
    createTime: '',
    isCollected: false,
    showCollect: true,
    vertical: false,
})
const titleRef = toRef(props, 'title')
const localTitle = ref(titleRef.value)

watch(() => props.title, (newVal) => {
    localTitle.value = newVal
})

const { handleSaveListName, handleRename } = useRename({ title: localTitle, listId: props.listId, input_dom, isRename })

const { handleSearch, handleSearchAction, handleSearchFocus } = useSearch({ content: searchContent, searchWidth, container_dom: search_dom, emit })

const isPlayingCurrentPlaylist = computed(() => {
    // 检查是否正在播放当前歌单：
    // 1. 本地歌单：直接匹配 listId
    // 2. 在线歌单：通过临时列表播放，匹配 tempListMeta.id
    const isDirectMatch = playMusicInfo.listId === props.listId
    const isTempMatch = playMusicInfo.listId === LIST_IDS.TEMP && tempListMeta.id === props.listId
    return (isDirectMatch || isTempMatch) && isPlay.value
})

const handlePlayPause = () => {
    if (isPlayingCurrentPlaylist.value) {
        pause()
    } else {
        emit('play')
    }
}

const handleClose = () => {
    showMenu.value = false
    isRename.value = false
    searchWidth.value = 85
}

</script>

<style lang="less" module>
@import "@renderer/assets/styles/layout.less";

.menu-container {
    position: absolute;
    left: 10%;
    top: 80%;
    border-radius: @radius-border * 1.5;
    background-color: var(--color-content-background);
    box-shadow: 0 1px 8px 0 rgba(0, 0, 0, .2);
    z-index: 10;
    overflow: hidden;
    padding: 8px;
    width: 80px;
    font-size: 14px;
    opacity: 0;
    transform: scale(0);
    transform-origin: 0 0 0;
    transition: .14s ease;
    transition-property: transform, opacity;

    div {
        cursor: pointer;
        line-height: 40px;
        border-radius: 5px;
        // color: var(--color-button-font);
        padding: 0 10px;
        text-align: center;
        outline: none;
        transition: @transition-normal;
        transition-property: background-color, opacity;
        box-sizing: border-box;
        .mixin-ellipsis-1();
        // background-color: var(--color-primary-light-600-alpha-800);

        &:hover {
            background-color: var(--color-primary-background-hover);
        }

        &:active {
            background-color: var(--color-primary-background-active);
        }

        &[disabled] {
            cursor: default;
            opacity: .4;

            &:hover {
                background: none !important;
            }
        }
    }
}

.listsInput {
    font-size: 1.5rem;
    font-weight: 700;
    position: relative;
    left: -8px;
    padding: 0 8px;
}

.menu-container.show {
    opacity: 1;
    transform: scale(1);
}

.cover {
    width: 200px;
}

.info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    margin-top: @gap;

    .title {
        font-size: 24px;
        font-weight: 700;
        color: var(--color-font);
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        width: 100%;

        .lock-icon {
            opacity: 0.28;
            color: var(--color-font);
            margin-right: 8px;

            .svg-icon {
                height: 26px;
                width: 26px;
            }
        }
    }

    .author {
        font-size: 14px;
        opacity: 0.88;
        color: var(--color-font);
        margin-top: @gap-sm;
    }

    .create {
        font-size: 14px;
        opacity: 0.68;
        color: var(--color-font);
        margin-top: 2px;
    }

    .description {
        font-size: 14px;
        opacity: 0.68;
        color: var(--color-font);
        margin-top: 24px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        cursor: pointer;

        &:hover {
            transition: opacity 0.3s;
            opacity: 0.88;
        }
    }

    .last {

        margin-top: @gap;

        .search {
            font-size: 16px;
            position: relative;
            background-color: var(--color-050);
            height: 40px;
            transition: all .3s ease;
            width: 200px;
            margin-top: @gap;

            input {
                width: 100%;
                height: 100%;
                border: none;
                background: none;
                border-radius: 25px;
                text-indent: 32px;
                border: none;
                outline: none;
                display: block;
                padding: 0;

                &:active,
                &:focus {
                    outline: none;
                }
            }

            svg {
                position: absolute;
                left: 10px;
                top: 50%;
                transform: translateY(-50%);
            }
        }
    }

    .buttons {
        display: flex;
        gap: @gap-sm;

        >div {
            position: relative;
        }

        button {
            margin-right: 16px;
        }

        .play {
            font-size: 18px;

            span {
                margin-left: 4px;
            }
        }
    }

    .heart {
        display: flex;
        cursor: pointer;
        justify-content: center;
        align-items: center;
        background: transparent;
        height: 40px;
        width: 40px;
        border-radius: 25%;
        transition: 0.2s;
        border: none;
        outline: none;
        font-size: 20px;
        cursor: pointer;
        background: var(--color-050);
        margin-right: 16px;
        position: relative;

        .svg-icon {
            color: #000;
            height: 16px;
            width: 16px;
        }

        &:first-child {
            margin-left: 0;
        }

        &:active {
            transform: scale(0.92);
        }

    }
}

.playlistInfo.vertical {
    flex-direction: column;

    .cover {
        width: 100%;
        max-width: 260px;
        margin: 0 auto;
    }

    .info {
        margin-left: 0;
        margin-top: @gap-md;
        max-width: 100%;
        height: auto;
    }
}
</style>
