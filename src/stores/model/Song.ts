import { types } from "mobx-state-tree";

const Song = types
  .model("Song", {
    artworkUrl: types.string,
    like: types.number,
    singer: types.string,
    title: types.string,
    trackId: types.identifier,
    url: types.string
  })
  .actions(self => {
    const songDislike = () => {
      self.like = self.like - 1;
    };
    const songLike = () => {
      self.like = self.like + 1;
    };
    return {
      songDislike,
      songLike
    };
  });

export type ISong = typeof Song.Type;

export default Song;
