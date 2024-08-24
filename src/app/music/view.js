"use client"
import React from "react";
import {SearchBar,SideBar,MusicBox} from "../component.js";
import avatar from './avatar.jpeg';
import Link from "next/link";
//import asake from "./asake.mp3"

export default function Main() {
  
var myMusic = [{title:'Yoga',album:'',artist:'Asake',size:'3.40mb',src:'asake.mp3',cover_photo:avatar,id:5},{title:'Another Music',album:'',artist:'Papy',size:'3.40mb',src:'music.mp3',cover_photo:avatar,id:6}]
 
  return (
    <div class="container">
      <div class="row">
        <div class="col">
          <div class="row">
            <div class="col">
              <SearchBar />
            </div>
          </div>
          <div class="row">
            <div class="col">
              <MusicBox data={myMusic} title="Trending Song"/>
            </div>
          </div>
        </div>
        </div>
      </div>
  );
}