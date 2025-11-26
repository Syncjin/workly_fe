import { Button, Icon, Input, Popup } from "@workly/ui";
import { LexicalEditor } from "lexical";
import { useState } from "react";

import { INSERT_YOUTUBE_COMMAND } from "../plugins/command";
import { parseYouTubeInput } from "../utils/youtubeUtils";

import * as s from "./youtubeDialog.css";

type YouTubeDialogProps = {
  editor: LexicalEditor;
  onPickYoutubeVideo?: () => Promise<string | null>;
  className?: string;
};

type YouTubePopupState = {
  isOpen: boolean;
  input: string;
  error: string | null;
  attempts: number;
};

export function YouTubeDialog({ editor, onPickYoutubeVideo, className }: YouTubeDialogProps) {
  const [youtubePopup, setYoutubePopup] = useState<YouTubePopupState>({
    isOpen: false,
    input: "",
    error: null,
    attempts: 0,
  });

  const handleYoutubePopupOpen = () => {
    setYoutubePopup({
      isOpen: true,
      input: "",
      error: null,
      attempts: 0,
    });
  };

  const handleYoutubePopupClose = () => {
    setYoutubePopup({
      isOpen: false,
      input: "",
      error: null,
      attempts: 0,
    });
  };

  const handleYoutubeInputChange = (value: string) => {
    let error: string | null = null;

    if (value.trim() && !parseYouTubeInput(value.trim())) {
      error = "유효하지 않은 YouTube URL 또는 비디오 ID입니다.";
    }

    setYoutubePopup((prev) => ({
      ...prev,
      input: value,
      error: error,
    }));
  };

  const handleYoutubeSubmit = () => {
    const input = youtubePopup.input.trim();
    const maxAttempts = 3;

    if (!input) {
      const newAttempts = youtubePopup.attempts + 1;

      if (newAttempts >= maxAttempts) {
        setYoutubePopup((prev) => ({
          ...prev,
          error: "입력이 필요합니다. 최대 재시도 횟수에 도달했습니다. 다시 시도하려면 대화상자를 닫고 다시 열어주세요.",
          attempts: newAttempts,
        }));
        return;
      }

      setYoutubePopup((prev) => ({
        ...prev,
        error: `YouTube URL 또는 비디오 ID를 입력해주세요. (${newAttempts}/${maxAttempts})`,
        attempts: newAttempts,
      }));
      return;
    }

    const videoId = parseYouTubeInput(input);

    if (!videoId) {
      const newAttempts = youtubePopup.attempts + 1;

      if (newAttempts >= maxAttempts) {
        setYoutubePopup((prev) => ({
          ...prev,
          error: "유효하지 않은 YouTube URL 또는 비디오 ID입니다. 최대 재시도 횟수에 도달했습니다. 지원되는 형식을 확인하고 다시 시도해주세요.",
          attempts: newAttempts,
        }));
        return;
      }

      setYoutubePopup((prev) => ({
        ...prev,
        error: `유효하지 않은 YouTube URL 또는 비디오 ID입니다. 지원되는 형식을 확인해주세요. (${newAttempts}/${maxAttempts})`,
        attempts: newAttempts,
      }));
      return;
    }

    try {
      editor.dispatchCommand(INSERT_YOUTUBE_COMMAND, {
        videoID: videoId,
        width: 560,
        height: 315,
      });

      handleYoutubePopupClose();
    } catch {
      setYoutubePopup((prev) => ({
        ...prev,
        error: "비디오 삽입 중 오류가 발생했습니다. 다시 시도해주세요.",
        attempts: prev.attempts + 1,
      }));
    }
  };

  const handleYoutubeCancel = () => {
    handleYoutubePopupClose();
  };

  const addYouTube = () => {
    void (async () => {
      try {
        if (onPickYoutubeVideo) {
          try {
            const input = await onPickYoutubeVideo();

            if (!input) {
              return;
            }

            const videoId = parseYouTubeInput(input.trim());

            if (!videoId) {
              alert("유효하지 않은 YouTube URL 또는 비디오 ID입니다.");
              return;
            }

            editor.dispatchCommand(INSERT_YOUTUBE_COMMAND, {
              videoID: videoId,
              width: 560,
              height: 315,
            });
          } catch {
            alert("YouTube 비디오 선택 중 오류가 발생했습니다.");
          }
        } else {
          handleYoutubePopupOpen();
        }
      } catch {
        alert("YouTube 비디오 추가 중 오류가 발생했습니다.");
      }
    })();
  };

  return (
    <>
      <button className={className} onClick={addYouTube} title="Insert Youtube">
        <Icon name="youtube-line" size={{ width: 20, height: 20 }} color="var(--color-gray-900)" />
      </button>

      <Popup open={youtubePopup.isOpen} onClose={handleYoutubePopupClose} variant="modal" size="md">
        <Popup.Header>YouTube 비디오 추가</Popup.Header>
        <Popup.Body>
          <div className={s.inputContainer}>
            <Input value={youtubePopup.input} size="sm" onChange={(e) => handleYoutubeInputChange(e.target.value)} placeholder="YouTube URL 또는 비디오 ID를 입력하세요" className={s.input} />
          </div>
          <div className={s.formatGuide}>
            <p className={s.formatTitle}>지원되는 형식:</p>
            <ul className={s.formatList}>
              <li>https://www.youtube.com/watch?v=VIDEO_ID</li>
              <li>https://youtu.be/VIDEO_ID</li>
              <li>https://www.youtube.com/embed/VIDEO_ID</li>
              <li>VIDEO_ID (11자리 영숫자)</li>
            </ul>
          </div>
          {youtubePopup.error && (
            <div className={s.errorContainer}>
              <p className={s.errorText}>{youtubePopup.error}</p>
            </div>
          )}
        </Popup.Body>
        <Popup.Footer>
          <div className={s.footerActions}>
            <Button variant="border" onClick={handleYoutubeCancel}>
              취소
            </Button>
            <Button variant="solid" onClick={handleYoutubeSubmit}>
              확인
            </Button>
          </div>
        </Popup.Footer>
      </Popup>
    </>
  );
}
