import { useEffect, useLayoutEffect, useReducer, useRef } from 'react';

import styles from './ContentManagerSubject.module.scss';
import ContentManagerArticle from './ContentManagerArticle';
import ContentManagerFolder from './ContentManagerFolder';
import { Content, Subject } from '../../defs/global';

export default function ContentManagerSubject({
    contents,
    subject,
    removeObject,
    modifyObject,
    loadContent,
    reportYCoords
}: {
    contents: Array<Content>;
    subject: Subject;
    removeObject: (object: Content, from: string) => void;
    modifyObject: <T extends Content>(from: T, to: T) => void;
    loadContent: (uuid: string) => void;
    reportYCoords: (uuid: string, top: number, bottom: number) => void;
}) {
    const [isOpen, toggleIsOpen] = useReducer((state) => !state, false);
    const subjectEl = useRef(null);

    useEffect(() => {
        subjectEl.current.style.setProperty(
            '--accent-color',
            `#${subject.color}`
        );
    }, []);

    useLayoutEffect(() => {});

    return (
        <div key={subject.name} className={styles.subject} ref={subjectEl}>
            <button onClick={toggleIsOpen}>
                <span
                    className={`material-icons ${
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
                <span className="material-icons">create</span>
            </button>
            <button>
                <span
                    className="material-icons"
                    onClick={() =>
                        removeObject(
                            subject,
                            contents.find(({ type }) => type === 'root').uuid
                        )
                    }
                >
                    delete
                </span>
            </button>
            <span className="material-icons">reorder</span>
            <div
                className={`${styles.expansion} ${
                    isOpen ? '' : styles.collapsed
                }`}
            >
                <div className={styles['add-content']}>
                    <button
                        className={styles['add-content--button']}
                        style={{ marginRight: '0.5rem' }}
                    >
                        add folder
                    </button>
                    <button className={styles['add-content--button']}>
                        add article
                    </button>
                </div>
                <div className={styles.children}>
                    {subject.children.map((uuid) => {
                        let content = contents.find((c) => c.uuid === uuid);
                        if (typeof content === 'undefined') {
                            if (isOpen) loadContent(uuid);
                            return null;
                        } else if (content.type === 'folder') {
                            return (
                                <ContentManagerFolder
                                    key={uuid}
                                    contents={contents}
                                    folder={content}
                                    removeObject={removeObject}
                                    modifyObject={modifyObject}
                                    loadContent={loadContent}
                                />
                            );
                        } else if (content.type === 'article') {
                            return (
                                <ContentManagerArticle
                                    key={uuid}
                                    article={content}
                                    removeObject={removeObject}
                                />
                            );
                        }
                    })}
                </div>
            </div>
        </div>
    );
}