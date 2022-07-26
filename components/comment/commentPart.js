import { useEffect } from "react";
import { commentState } from "../recoil/recoil";
import { useRecoilValue } from "recoil";
import styles from "../bestComment/Bestcomments.module.css";
import LikePart from "./likePart";

const CommentPart = ({
  isSubmit,
  addComment,
  agreeComment,
  alternativeComment,
  disagreeComment,
}) => {
  const commentS = useRecoilValue(commentState);

  useEffect(() => {
    console.log(addComment);
    if (addComment != "") {
      console.log("추가 댓글!");
      commentSort().push({id:Math.random(), ...addComment});
    }
  }, [isSubmit]);


  function Author({ level }) {
    console.log(level);
    if (commentS === "agreeComment") {
      return (
        <span
          style={{
            background: `rgba(35, 115, 235, ${0.1 + level * 0.006})`,
          }}
          className={styles.author}
        >
          &nbsp;{level}&nbsp;
        </span>
      );
    } else if (commentS === "alternativeComment") {
      return (
        <span
          style={{
            background: `rgba(255, 199, 0, ${0.1 + level * 0.006})`,
          }}
          className={styles.author}
        >
          &nbsp;{level}&nbsp;
        </span>
      );
    } else if (commentS === "disagreeComment") {
      return (
        <span
          style={{
            background: `rgba(255, 0, 0, ${0.1 + level * 0.006})`,
          }}
          className={styles.author}
        >
          &nbsp;{level}&nbsp;
        </span>
      );
    }
  }
  const commentSort = () => {
    if (commentS == "agreeComment") {
      return agreeComment;
    } else if (commentS == "alternativeComment") {
      return alternativeComment;
    } else {
      return disagreeComment;
    }
  };

  return (
    <div className={styles.commentlist}>
      {commentSort() != "" ? (
        commentSort().map((data) => {
          return (
            <div key={Math.random()} className={styles.card}>
              <div>
                <header className={styles.header}>
                  <Author level={data.authorLevel} />
                  <div className={styles.name}>&nbsp;{data.authorName}</div>
                  <LikePart
                    data={data}
                    op={
                      commentS === "agreeComment"
                        ? 1
                        : commentS === "alternativeComment"
                        ? 2
                        : 3
                    }
                  />
                </header>
                <div className={styles.textArea}>{data.article}</div>
              </div>
            </div>
          );
        })
      ) : (
        <div className={styles.card}>
          <pre className={styles.textArea}>
            댓글이 없습니다. 첫 댓글의 주인공이 되주세요!
          </pre>
        </div>
      )}
    </div>
  );
};

export default CommentPart;
