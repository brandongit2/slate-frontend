import {motion, useDragControls} from 'framer-motion';
import {
    MutableRefObject,
    useContext,
    useEffect,
    useLayoutEffect,
    useReducer,
    useRef
} from 'react';
import {v4 as uuidv4} from 'uuid';

import styles from './ContentManagerSubject.module.scss';
import ContentManagerArticle from './ContentManagerArticle';
import ContentManagerFolder from './ContentManagerFolder';
import {ContentManagerContext} from '../../contexts/contentManager';
import {Content, Subject} from '../../defs/content';

export default function ContentManagerSubject({
    subject,
    contentManagerRef,
    startReorder,
    updateYPositions
}: {
    subject: Subject;
    contentManagerRef: MutableRefObject<any>;
    startReorder?: (evt: MouseEvent, object: Content) => void;
    updateYPositions?: () => void;
}) {
    const {loadedContent, addObject, removeObject, loadContent} = useContext(
        ContentManagerContext
    );

    const [isOpen, toggleIsOpen] = useReducer((state) => !state, false);
    const subjectEl = useRef(null);
    const reorderButton = useRef(null);

    useEffect(() => {
        subjectEl.current.style.setProperty(
            '--accent-color',
            `#${subject.color}`
        );
    }, []);
    if (updateYPositions) useLayoutEffect(updateYPositions);
    const dragControls = useDragControls();

    function addFolder(parentUuid: string, after: string) {
        addObject(
            {
                uuid: uuidv4(),
                type: 'folder',
                name: uuidv4(),
                children: []
            },
            parentUuid,
            after
        );
    }

    function addArticle(parentUuid: string, after: string) {
        addObject(
            {
                uuid: uuidv4(),
                type: 'article',
                name: uuidv4(),
                author: '',
                content: '',
                children: []
            },
            parentUuid,
            after
        );
    }

    return (
        <motion.div
            drag="y"
            dragElastic={0.1}
            dragControls={dragControls}
            dragConstraints={contentManagerRef}
            layoutId={subject.uuid}
            transition={{ease: 'easeInOut', duration: 0.2}}
            className={styles.subject}
            ref={subjectEl}
            onDragStart={(evt, info) => {
                // Prevent dragging unless event target is reorder button
                // https://github.com/framer/motion/issues/363#issuecomment-621355442
                if (evt.target !== reorderButton.current) {
                    (dragControls as any).componentControls.forEach(
                        (entry: any) => {
                            entry.stop(evt, info);
                        }
                    );
                    return;
                }

                startReorder && startReorder(evt as MouseEvent, subject);
            }}
        >
            <button onClick={toggleIsOpen}>
                <span
                    className={`material-icons-sharp ${
                        styles['subject--expand-button']
                    } ${isOpen ? styles.open : ''}`}
                >
                    chevron_right
                </span>
            </button>
            <p
                className={styles.info}
                style={{
                    color: `#${subject.color}`
                }}
            >
                <span
                    className={styles['info--title']}
                    style={{
                        background: `#${subject.color}`
                    }}
                >
                    {subject.name}
                </span>
                <span
                    style={{
                        width: '0.5rem',
                        display: 'inline-block'
                    }}
                />
                {subject.description}
            </p>
            <button>
                <span className="material-icons-sharp">create</span>
            </button>
            <button>
                <span
                    className="material-icons-sharp"
                    onClick={() => removeObject(subject, subject.parent)}
                >
                    delete
                </span>
            </button>
            <span
                className="material-icons-sharp"
                style={{cursor: 'ns-resize'}}
                ref={reorderButton}
            >
                drag_indicator
            </span>
            <div
                className={`${styles.expansion} ${
                    isOpen ? '' : styles.collapsed
                }`}
            >
                <div className={styles['add-content']}>
                    <button
                        className={styles['add-content--button']}
                        style={{marginRight: '0.5rem'}}
                        onClick={() => {
                            addFolder(
                                subject.uuid,
                                subject.children[subject.children.length - 1] ||
                                    '0'
                            );
                        }}
                    >
                        add folder
                    </button>
                    <button
                        className={styles['add-content--button']}
                        onClick={() => {
                            addArticle(
                                subject.uuid,
                                subject.children[subject.children.length - 1] ||
                                    '0'
                            );
                        }}
                    >
                        add article
                    </button>
                </div>
                <div className={styles.children}>
                    {subject.children.map((uuid) => {
                        let content = loadedContent.find(
                            (c) => c.uuid === uuid
                        );
                        if (typeof content === 'undefined') {
                            if (isOpen) loadContent(uuid);
                            return null;
                        } else if (content.type === 'folder') {
                            return (
                                <ContentManagerFolder
                                    key={uuid}
                                    folder={content}
                                />
                            );
                        } else if (content.type === 'article') {
                            return (
                                <ContentManagerArticle
                                    key={uuid}
                                    article={content}
                                />
                            );
                        }
                    })}
                </div>
            </div>
        </motion.div>
    );
}
