<template>
    <div :class="$style.playlistInfo" @click.stop="handleClose">
        <common-cover
:list-id="listId" :class="$style.cover" :image-url="resizeImage(cover, 512)" :play-button-size="playButtonSize"
            :show-play-button="true" :always-show-shadow="true" :click-cover-to-play="false" :fixed-size="288"
            type="playlist" :cover-hover="false" @play="emit('play')"
/>
        <div :class="$style.info">
            <div ref="input_dom">
                <h3 v-show="!isRename" :class="$style.title">{{ localTitle }}</h3>
                <base-input
v-show="isRename" v-model="localTitle" :class="$style.listsInput" type="text"
                    :value="localTitle" :placeholder="localTitle" @keyup.enter="handleSaveListName"
                    @blur="handleSaveListName" @click.stop
/>
            </div>
            <div :class="$style.author">
                <p>Playlist by {{ author }}</p>
            </div>
            <p :class="$style.create"><span v-if="createTime">创建于 {{ createTime }}·</span>{{ count }}首歌</p>
            <p :class="$style.description">{{ description }}</p>
            <div :class="$style.last">
                <div :class="$style.buttons">
                    <base-button :class="$style.play" :radius="8" active @click="emit('play')">
                        <base-svg-icon style="height: 16px" icon-class="play" /> <span>{{ $t('list__play') }}</span>
                    </base-button>
                    <div v-if="showCollect" :class="$style.heart" @click="emit('collect')"><base-svg-icon
                            style="height: 16px" :icon-class="!isCollected ? 'heart' : 'heart-solid'"
/></div>
                    <div
v-if="listId != LIST_IDS.LOVE && listId != LIST_IDS.DEFAULT && !showCollect"
                        :class="$style.heart" @click="emit('delete')"
>
                        <base-svg-icon style="height: 16px" icon-class="delete" />
                    </div>
                    <div :class="$style.heart" @click.stop="showMenu = !showMenu">
                        <base-svg-icon style="height: 16px" icon-class="more" />
                        <div :class="[$style.menuContainer, { [$style.show]: showMenu }]">
                            <div
v-if="listId != LIST_IDS.LOVE && listId != LIST_IDS.DEFAULT && !showCollect"
                                @click="handleRename"
>{{ $t('lists__rename') }}</div>
                            <div @click="handleSearch">{{ $t('list__search') }}</div>
                        </div>
                    </div>
                </div>

                <div ref="search_dom" :style="{width: searchWidth + 'px'}" :class="$style.search">
                    <base-svg-icon icon-class="search" style="height: 16px" />
                    <input
                    v-model="searchContent"
                    :placeholder="$t('list__search')"
                    type="text"
                    @blur="handleSearchAction" @keyup.enter="handleSearchAction"
                    @click.stop="handleSearchFocus"
                    />
                </div>
            </div>

        </div>
    </div>
</template>

<script lang="ts" setup>
import { defineEmits, ref, toRef, watch } from 'vue'
import { LIST_IDS } from '@common/constants'
import useRename from './useRename'
import useSearch from './useSearch'
import { resizeImage } from '@renderer/utils/resizeCover'

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
}>(), {
  playButtonSize: 22,
  description: '',
  count: 0,
  createTime: '',
  isCollected: false,
  showCollect: true,
})
const titleRef = toRef(props, 'title')
const localTitle = ref(titleRef.value)

watch(() => props.title, (newVal) => {
  localTitle.value = newVal
})

const { handleSaveListName, handleRename } = useRename({ title: localTitle, listId: props.listId, input_dom, isRename })

const { handleSearch, handleSearchAction, handleSearchFocus } = useSearch({ content: searchContent, searchWidth, container_dom: search_dom, emit })

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
        .mixin-ellipsis-1;
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
    font-size: 2.25rem;
    font-weight: 700;
    position: relative;
    left: -8px;
    padding: 0 8px;
}

.menu-container.show {
    opacity: 1;
    transform: scale(1);
}

.playlistInfo {
    display: flex;
}

.cover {
    width: 290px;
}

.info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    margin-left: 56px;
    max-width: calc(100% - 290px);

    .title {
        font-size: 36px;
        font-weight: 700;
        color: var(--color-900);
        height: 48px;
        line-height: 48px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        width: 100%;

        .lock-icon {
            opacity: 0.28;
            color: var(--color-900);
            margin-right: 8px;

            .svg-icon {
                height: 26px;
                width: 26px;
            }
        }
    }

    .author {
        font-size: 18px;
        opacity: 0.88;
        color: var(--color-900);
        margin-top: 24px;
    }

    .create {
        font-size: 14px;
        opacity: 0.68;
        color: var(--color-900);
        margin-top: 2px;
    }

    .description {
        font-size: 14px;
        opacity: 0.68;
        color: var(--color-900);
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
    .last{
        margin-top: 32px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .search{
            border-radius: 25px;
            font-size: 16px;
            position: relative;
            background-color: var(--color-050);
            height: 40px;
            transition: all .3s ease;
            width: 85px;
            input{
                width: 100%;
                height: 100%;
                border: none;
                background: none;
                border-radius: 25px;
                text-indent: 40px;
                border: none;
                outline: none;
                display: block;
                padding: 0;
                &:active, &:focus{
                    outline: none;
                }
            }
            svg{
                position: absolute;
                left: 14px;
                top: 50%;
                transform: translateY(-50%);
            }
        }
    }
    .buttons {
        display: flex;
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
</style>
