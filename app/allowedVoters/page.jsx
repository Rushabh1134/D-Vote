"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useCallback, useContext, useState, } from 'react';
import { useDropzone } from "react-dropzone";

import { VotingContext } from '@/context/Voter';
import images from '@/assets/creator1.png';
import upload_image from '@/assets/upload.png';
import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import Style from "@/styles/allowedVoter.module.css"

const allowedVoters = () => {

    const [fileUrl, setFileUrl] = useState(null);
    const [formInput, setFormInput] = useState({
        name: "",
        address: "",
        position: ""
    });

    const router = useRouter();
    const { uploadToIPFS, createVoter } = useContext(VotingContext);

    const onDrop = useCallback(async (acceptedFile) => {
        const url = await uploadToIPFS(acceptedFile[0]);
        setFileUrl(url);
    });

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: "image/*",
        maxSize: 5000000,
    });

    // console.log(fileUrl);

    return (
        <div className={Style.createVoter}>
            <div>
                {fileUrl && (
                    <div className={Style.voterInfo}>
                        <Image src={fileUrl} alt="Voter Image" width={200} height={200} />
                        <div className={Style.voterInfo_paragraph}>
                            <p>
                                Name: <span>&nbps;{formInput.name}</span>
                            </p>
                            <p>
                                Add: <span>&nbps;{formInput.address.slice(0, 20)}</span>
                            </p>
                            <p>
                                Pos: <span>&nbps;{formInput.position}</span>
                            </p>
                        </div>
                    </div>
                )}
                {
                    !fileUrl && (
                        <div className={Style.sideInfo}>
                            <div className={Style.sideInfo_box}>
                                <h4>
                                    Create Candidate for Voting
                                </h4>
                                <p>
                                    Blockchain voting orginazation, provide ehretium ecosystem
                                </p>
                                <p className={Style.sideInfo_para}>
                                    Contract Candidate
                                </p>
                            </div>
                            <div className={Style.car}>
                                {
                                    // voterArray.map((el,i) => {
                                    //     <div key={i+1} className={Style.card_box}>
                                    //         <div className={Style.image}>
                                    //             <img src="" alt="Profile Photo" />
                                    //         </div>
                                    //         <div className={Style.card_info}>
                                    //             <p>
                                    //                 Name: {el.name}
                                    //             </p>
                                    //             <p>
                                    //                 Address: {el.address}
                                    //             </p>
                                    //             <p>
                                    //                 Position: {el.position}
                                    //             </p>
                                    //         </div>
                                    //     </div>
                                    // })
                                }
                            </div>
                        </div>
                    )
                }
            </div>
            <div className={Style.voter}>
                <div className={Style.voter_container}>
                    <h1>Create New Voter</h1>
                    <div className={Style.voter_container_box}>
                        <div className={Style.voter_container_box_div}>
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <div className={Style.voter_containor_box_div_info}>
                                    <p>
                                        Upload File: JPG, PNG, GIF, WEBM Max 10mb
                                    </p>
                                    <div className={Style.voter_container_box_div_image}>
                                        <Image src={upload_image} width={150} height={150} objectFit="contain" alt='File Upload'></Image>
                                    </div>
                                    <p>
                                        Drag & Drop File
                                    </p>
                                    <p>
                                        or Browse Media on your device
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={Style.input_container}>
                    <Input
                        inputType='text'
                        title='Name'
                        placeholder='Voter Name'
                        handleClick={(e) =>
                            setFormInput({ ...formInput, name: e.target.value })
                        } />
                    <Input
                        inputType='text'
                        title='Address'
                        placeholder='Voter Address'
                        handleClick={(e) =>
                            setFormInput({ ...formInput, address: e.target.value })
                        } />
                    <Input
                        inputType='text'
                        title='Position'
                        placeholder='Voter Position'
                        handleClick={(e) =>
                            setFormInput({ ...formInput, position: e.target.value })
                        } />

                    <div className={Style.Button}>
                        <Button btnName="Authorized Voter" handleClick={() => createVoter(formInput, fileUrl, router)} />
                    </div>
                </div>
            </div>
            <div className={Style.createdVoter}>
                <div className={Style.createdVoter_info}>
                    <Image src={images} alt="User Profile" />
                    <p>Notice foruser</p>
                    <p>Organizer <span>0x2345683456..</span></p>
                    <p>Only Organizer of the voting contract can create voter</p>
                </div>

            </div>
        </div>
    );
};

export default allowedVoters