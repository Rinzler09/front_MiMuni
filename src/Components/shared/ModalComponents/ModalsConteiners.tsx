import { Fragment, ReactNode } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';

interface Props {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
    maxWidth?: string;
}

export default function ModalsConteiners({ open, onClose, children, title, maxWidth = '45rem' }: Props) {
    return (
        <Transition show={open} as={Fragment}>
            <Dialog as="div" onClose={onClose}>
                <div className="fixed inset-0 z-[99999]">
                    {/* BACKDROP */}
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black/60" />
                    </TransitionChild>

                    {/* CENTER */}
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-200"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel
                                style={{
                                    width: '100%',
                                    maxWidth: maxWidth,
                                    background: '#fff',
                                    borderRadius: '1rem',
                                    padding: '2rem',
                                    boxShadow: '0 20px 25px -5px rgba(0,0,0,.1)',
                                }}
                            >
                                {title && (
                                    <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                        {title}
                                    </h2>
                                )}
                                {children}
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>

    );
}