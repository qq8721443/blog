import { useState } from "react";

export function Button() {
  const [state, setState] = useState("버튼임");
  return <button type="button">버튼임 ㅇㅇ</button>;
}
