/**
 * 第二引数に入れた関数を addEventListener で一度だけ実行する（実行後 removeEvent）するオブジェクトを返す
 *
 * @param option.elems removeEventListener したい要素を格納した配列
 * @param option.fn fn addEventListener 時に実行する関数
 * @param option.isCheckedTarget クリックされた対象が addEventListener が設定された要素と同一であるかチェックするか
 * @param option.isRemovedAll イベントが発火した時、同一の処理（関数）が設定されている要素全て removeEvent するか
 * @return addEventListener の第二引数に使用するオブジェクト
 */
const getInstantListener = (option) => {
    const {
        elems,
        fn,
        isCheckedTarget,
        isRemovedAll,
    } = option;

    return {
        handleEvent(event) {
            const index = elems.indexOf(event.target);
            if (isCheckedTarget && index < 0) return false;
            if (isRemovedAll) {
                for (const elem of elems) {
                    elem.removeEventListener(event.type, this);
                }
            } else {
                elems[index].removeEventListener(event.type, this)
                elems.splice(index, 1);
            }
            fn(event, this);
            return false;
        }
    }
};

const target = document.getElementsByClassName('js-checkMacOS');
const { length } = target;
let isOpen = false;
const closeImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABkklEQVRYR62Xy1HDMBBAn8e+k'+
                '05wKgA6gE6gEugEOkg4c4jpJNydSWaF5VHs6LOSckhmMk7e00q72m2YXgfoT/DewssWjvb7mp8H2Jzgs4W3LQzy3428TfAdsDn'+
                'D0MFTbQmBj7BroAeO7T9jaFy4XW1tiQXcYoxE8wP7Bh6Woa4l4YEb3Bm+JQKyL3vgvrZECA78tvBoz0B1iRS4nDMjMB3EahKp8'+
                'DkLakpo4CuB0kho4TcFciVy4F4BrUQuPCiQKiHPORVumckm1UJVdc4CX82P1YlpFVJe1fBoBFKywyMeXbn9XTQCGRLJ8OQIKCR'+
                'U8CyBwIGTy0V9lau2IAS3UdJKJAlE8nx1DjUSUYFYkZno2Vd5UCAGlyIjAiX9hFcgBW4rXKxYhXrMmwIaeEqKhs7ESiAHXiJxJ'+
                'VACz5W4aslKbjU3FzVnYm5Ka8G1kTBteW24RsI7mNi+vXREi2yHGUxkKJXB5M7ZR/Wt5mtoAp3VnzuYuBJV4Z7tMHAznDoP9CN'+
                '8dPBcGvZQezfCVwevdjy/AKLrIwK39FItAAAAAElFTkSuQmCC';

for (let i = 0; i < length; i++) {
    target[i].addEventListener('click', (e) => {
        const isOverVer = /Mac OS X 10.14|Mac OS X 10_14/.test(window.navigator.userAgent);
        console.log('isOverVer:', isOverVer)
        if (isOverVer) {
            e.preventDefault();
            e.stopPropagation();
            if (isOpen === false) {
                isOpen = true;
                const modal = document.createElement('div');
                const close = document.createElement('img');
                const box = document.createElement('div');
                const boxTextArea = document.createElement('p');
                const boxText = document.createTextNode('お使いの Mac OS バージョンではこの機能はご利用になれません');
                close.src = closeImage;
                close.width = '16';
                close.height = '16';
                close.alt = '閉じる';
                const deleteModal = () => {
                    const del = () => {
                        document.body.removeChild(modal);
                        isOpen = false;
                    };
                    const option = {
                        elems: [modal],
                        fn: del,
                        isCheckedTarget: false,
                        isRemovedAll: false,
                    }
                    const listener = getInstantListener(option)
                    modal.addEventListener('transitionend', listener)
                    modal.style.opacity = 0;
                }
                const option = {
                    elems: [modal, close],
                    fn: deleteModal,
                    isCheckedTarget: true,
                    isRemovedAll: true,
                }
                const listener = getInstantListener(option);
                modal.addEventListener('click', listener);
                close.addEventListener('click', listener);
                modal.setAttribute('style',`
                    position: fixed;
                    top: 0;
                    left: 0;
                    height: 100vh;
                    width: 100vw;
                    background-color: rgba(0,0,0, .3);
                    transition: .3s;
                    z-index: 9999;
                `);
                box.setAttribute('style',`
                    position: absolute;
                    transform: translate(-50%, -50%);
                    top: 50%;
                    left: 50%;
                    width: 460px;
                    line-height: 1.7;
                    padding: 32px 25px 32px;
                    border-radius: 3px;
                    background-color: #fff;
                    color: #333;
                    text-align: center;
                    font-feature-settings: "palt";
                    box-shadow: 0 2px 5px 1px rgba(0,0,0,0.3);
                    font-weight: bold;
                    box-sizing: content-box;
                `);
                close.setAttribute('style', `
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    cursor: pointer;
                `);
                boxTextArea.append(boxText);
                box.appendChild(boxTextArea);
                box.appendChild(close);
                modal.appendChild(box);
                document.body.appendChild(modal);
            }
        }
    });
}