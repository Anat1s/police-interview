import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Lock, RefreshCw, RotateCcw, CheckCircle2, Home, Megaphone, UserCheck } from 'lucide-react';

// ==========================================
// 🔐 [권한 관리 시스템] 허가된 사용자 명단
// ==========================================
const AUTHORIZED_USERS: Record<string, string> = {
  "0817": "정덕경", // 관리자1
  "2673": "정은빈", // 관리자2
  "2048": "강민지",
  "7193": "이태호",
  "5821": "황희태",
  "3604": "김현희",
  "8472": "오해람",
  "1956": "최정규",
  "4380": "남지윤",
  "0359": "심주혜",
  "2830": "진민영",
  "0223": "이수빈",

  // --- 온라인 특강반 ---
  "1245": "강진우",
  "9031": "김서현",
  "6478": "김수련",
  "3192": "김영선",
  "8504": "김진이",
  "4721": "나한결",
  "7619": "민희경",
  "5283": "양연주",
  "1067": "오서연",
  "9350": "이대희",
  "2594": "이민찬",
  "7777": "올킬면접 조교", // 특별 번호
  "3409": "이수민",
  "8162": "이언지",
  "5947": "이현지",
  "4026": "이혜원",
  "7310": "장보경",
  "2158": "조윤정",
  "6903": "하지향",
  "1582": "홍서린"
};

// 1. 발표면접 주제 (1~8번 통합)
const PRESENTATION_TOPICS = [
  { 
    id: 1, 
    title: "아동학대 의심 신고 및 부모의 거부 상황", 
    content: "아파트 인근 주민으로부터 아이의 비명소리가 들린다는 신고를 받고 출동했습니다. 현장 도착 시 부모는 '내 자식 교육하는 데 왜 간섭이냐'며 집 안으로 들어오는 것을 강력히 거부하고 있습니다. 아이의 모습은 보이지 않으나 문틈으로 집 안의 가재도구가 어지럽게 널려 있는 것이 확인됩니다. 경찰관으로서 법적 근거와 함께 현장 조치 방안을 발표하시오.",
    followups: [
      "부모가 영장을 요구하며 끝까지 문을 열어주지 않는다면 구체적으로 어떻게 강제 진입할 것입니까?",
      "아이를 부모로부터 분리 조치하는 과정에서 부모가 물리적으로 거세게 저항한다면 어떻게 대처하겠습니까?",
      "현장에서 아이의 외상이 명확하지 않고 아이도 학대 사실을 부인할 경우, 어떻게 판단하겠습니까?",
      "부모가 경찰의 조치에 대해 '과잉 대응'이라며 국가인권위원회에 진정하겠다고 협박한다면?",
      "가정폭력이나 아동학대 현장에서 경찰관이 가장 주의해야 할 2차 피해는 무엇이라고 생각합니까?",
      "강제 진입 후 확인해보니 훈육 중이었고 학대 정황이 전혀 없었다면, 부모의 거센 항의에 어떻게 대처하겠습니까?",
      "아이가 분리 조치를 거부하고 부모에게 매달리며 울부짖는다면 어떻게 설득하겠습니까?",
      "현장에 출동한 아동학대전담공무원과 조치 방향에 대해 의견이 충돌한다면 누구의 판단을 우선시해야 합니까?",
      "부모 중 한 명은 학대를 인정하지만, 다른 한 명은 절대 아니라며 출입을 막는다면 어떻게 조치하겠습니까?",
      "현장 출입 및 조사권의 법적 근거가 되는 법률은 무엇이며, 그 요건은 어떻게 됩니까?",
      "문을 강제 개방하기 위해 소방의 협조를 요청했는데, 소방 측에서 화재 등 긴급상황이 아니라며 거절한다면?",
      "분리 조치된 아동을 보호시설로 인계한 후, 담당 경찰관으로서 추가적으로 확인하거나 조치해야 할 사항은 무엇입니까?"
    ]
  },
  { 
    id: 2, 
    title: "스토킹 가해자의 피해자 주거지 침입 시도", 
    content: "잠정 조치(접근금지) 명령이 내려진 스토킹 가해자가 피해자의 집 앞 복도에서 문을 두드리며 고함을 지르고 있다는 신고가 접수되었습니다. 피해자는 공포에 질려 집 안에서 나오지 못하고 있으며, 가해자는 술에 취해 대화가 불가능한 상태입니다. 주변 이웃들이 나와서 구경을 하고 있는 가운데, 가해자 검거 및 피해자 보호 방안에 대해 발표하시오.",
    followups: [
      "가해자가 문을 부수고 들어가려는 긴박한 상황이라면, 테이저건이나 총기를 사용할 의향이 있습니까?",
      "피해자가 극도의 불안감에 시달려 경찰 출동이 늦었다며 심하게 화를 낸다면 어떻게 대처하겠습니까?",
      "스토킹 가해자가 '단순히 놓고 온 물건을 찾으러 온 것'이라며 혐의를 완강히 부인한다면?",
      "주변 이웃들이 이 상황을 스마트폰으로 촬영하며 경찰의 조치를 방해한다면 어떻게 통제할 것입니까?",
      "피해자에게 지급된 스마트워치가 현장 위치를 잘못 잡아 출동이 지연되었다면 어떻게 사과하고 조치하겠습니까?",
      "잠정조치 위반으로 현행범 체포 시, 가해자가 자해를 시도하며 난동을 부린다면 어떻게 제압하겠습니까?",
      "가해자가 피해자의 직장 상사이고, 피해자가 처벌보다 조용히 해결되기를 원한다고 번복한다면 어떻게 조치하겠습니까?",
      "현장 도착 전 가해자가 이미 도주했다면, 피해자 보호를 위해 가장 먼저 취해야 할 조치는 무엇입니까?",
      "스토킹 범죄에서 가해자 물리적 격리뿐만 아니라 피해자의 심리적 안정을 위해 경찰이 지원할 수 있는 제도는 무엇이 있습니까?",
      "가해자가 술에 취해 심신미약을 주장하며 다음 날 조사받겠다고 귀가를 요구한다면?",
      "현장에 가해자의 가족이 나타나 '우리 애가 그럴 애가 아니다'라며 체포를 육탄으로 방해한다면?",
      "접근금지 명령의 실효성을 높이기 위해 현장 출동 경찰관으로서 어떤 제도적 개선이 필요하다고 생각합니까?"
    ]
  },
  { 
    id: 3, 
    title: "대규모 집회 중 긴급차량 통행로 확보", 
    content: "도심 내 대규모 집회로 인해 왕복 6차선 도로가 모두 점거된 상황입니다. 이때 인근 병원으로 이송 중인 응급 환자가 탄 구급차가 집회 대열에 막혀 이동하지 못하고 있다는 지원 요청이 들어왔습니다. 집회 주최 측은 도로 점거의 정당성을 주장하며 비켜주지 않고 있습니다. 시민의 생명권과 집회의 자유가 충돌하는 현장에서 어떻게 대처할지 발표하시오.",
    followups: [
      "주최 측이 '합법적으로 신고된 집회'라며 절대 길을 비켜주지 않는다면 물리력을 사용해 강제 해산시킬 것입니까?",
      "구급차 통행로를 확보하는 진압 과정에서 시위대 일부가 크게 다쳤다면 이는 전적으로 현장 경찰의 책임입니까?",
      "구급차 안의 환자가 생명이 위독한 상태인데, 시위대와의 대규모 충돌을 우려해 물리력 행사를 망설이는 상사가 있다면?",
      "언론에서 경찰이 평화 시위대를 무리하게 과잉 진압하여 유혈 사태를 빚었다고 보도한다면 어떻게 대처하겠습니까?",
      "헌법상 보장된 '집회의 자유'와 국민의 '생명권'이 충돌할 때, 경찰관으로서 현장 판단의 최우선 기준은 무엇이어야 합니까?",
      "구급차 진입로 확보를 위해 시위대 방송차량의 전원을 강제로 차단하는 조치가 현행법상 적법하다고 생각합니까?",
      "시위대 중 일부가 구급차 바퀴 앞으로 누워버리며 이송을 극렬히 막는다면, 가장 먼저 어떤 조치를 취해야 합니까?",
      "주최 측 집행부와 대화로 해결하려 했으나 완전히 거부당했습니다. 다음 단계의 경찰 조치는 무엇입니까?",
      "현장에서 집회 관리 책임자인 경비과장과 무전 연결이 끊긴 상황이라면, 본인(팀원)의 독단적 판단으로 길을 뚫겠습니까?",
      "응급 환자가 타고 있지 않은 빈 구급차라는 주최 측의 의혹이 제기된다면, 어떻게 확인하고 대처하겠습니까?",
      "시위대가 구급차 우회로가 있다며 다른 길로 가라고 주장하지만, 우회로는 시간이 3배 이상 소요된다면 어떻게 하겠습니까?",
      "집회 현장에서 경찰의 질서유지선(폴리스라인)이 가지는 법적 의미와 침범 시 강제 조치 요건은 무엇입니까?"
    ]
  },
  { 
    id: 4, 
    title: "보이스피싱 현장 검거 및 증거 인멸 저지", 
    content: "은행 직원의 신고로 현금 수거책으로 의심되는 인물을 은행 앞에서 대면했습니다. 경찰관을 확인한 피의자가 가지고 있던 가방을 던지고 도주하며 자신의 휴대전화를 바닥에 던져 파손하려고 시도합니다. 주변에 행인들이 많아 물리력 행사가 제한적인 상황에서 피의자 검거와 증거물 확보를 위한 조치 과정을 발표하시오.",
    followups: [
      "피의자가 던진 휴대전화가 이미 심하게 파손되어 전원이 들어오지 않는 상황이라면 현장에서 어떻게 증거를 보전하겠습니까?",
      "피의자가 도주하는 과정에서 쫓아가다 행인과 부딪혀 행인이 크게 다쳤습니다. 검거와 구호 중 무엇을 먼저 하겠습니까?",
      "현금 수거책이 검거 후 '나는 고액 알바인 줄 알았지 범죄인 줄 진짜 몰랐다'며 눈물을 흘리며 억울함을 호소한다면?",
      "물리력 사용 기준에 따라, 흉기가 없는 도주 피의자에게 인파가 많은 곳에서 테이저건을 발사할 수 있습니까?",
      "보이스피싱 수거책 검거 시, 피의자의 인권 보호와 신속한 증거 확보 중 현장에서 더 충돌하기 쉬운 가치는 무엇이라고 봅니까?",
      "파손된 휴대전화 외에 피의자가 소지하고 있던 다량의 피해금(현금)에 대해 현장에서 어떤 절차를 거쳐 압수해야 합니까?",
      "도주하는 피의자를 제압하는 과정에서 피의자가 골절상을 입었다면, 향후 제기될 과잉진압 논란에 어떻게 대응하겠습니까?",
      "피의자가 잡힌 직후, 총책으로 보이는 사람에게서 전화가 걸려 온다면 현장에서 경찰관이 전화를 받아 대응하겠습니까?",
      "피해자인 은행 고객이 충격을 받아 현장에서 실신했다면, 피의자 검거 후 피해자 구호는 어떻게 진행할 것입니까?",
      "피의자가 미성년자(촉법소년 아님)로 밝혀졌고, 현장에서 부모를 부르라며 일체의 조사를 거부한다면?",
      "증거물인 현금 가방을 던진 위치가 하필 8차선 도로 한가운데라 차량 통행에 방해가 되고 훼손 우려가 있다면?",
      "보이스피싱 범죄의 특성상 하부 조직원 검거가 상선(총책) 검거로 이어지기 어려운데, 출동 경찰관의 어떤 초기 조치가 가장 중요합니까?"
    ]
  },
  { 
    id: 5, 
    title: "자살 암시자가 흉기를 들고 대치하는 상황", 
    content: "생활고를 비관한 30대 남성이 옥상 난간에 걸터앉아 흉기를 자신의 목에 대고 투신하겠다고 위협 중입니다. 현장에는 이미 가족들이 도착해 오열하고 있어 남성의 흥분도가 매우 높습니다. 에어매트 설치가 어려운 지형적 특성이 있는 경우, 남성을 진정시키고 안전하게 구조하기 위한 경찰관으로서의 대화 전략과 조치 방안을 발표하시오.",
    followups: [
      "흥분한 남성이 갑자기 흉기를 출동 경찰관에게 던지며 공격적인 태도를 보인다면 어떻게 제압하겠습니까?",
      "가족들이 '경찰이 자극해서 오히려 뛰어내리려 한다'며 당장 철수하라고 오열하며 요구한다면 어떻게 하겠습니까?",
      "장시간의 설득 끝에 남성이 끝내 투신하여 사망한다면, 출동 경찰관으로서 어떤 법적/도의적 책임감을 느킬 것 같습니까?",
      "위기 협상(대화) 과정에서 흥분한 대상자에게 절대 해서는 안 될 말이나 행동은 무엇이라고 생각합니까?",
      "남성을 흉기를 뺏고 안전하게 구조한 직후, 현장에서 가장 먼저 취해야 할 후속 조치는 무엇입니까?",
      "위험한 현장에서 대상자가 흉기를 휘두를 때 본인의 안전을 감수하고 제압에 나서는 것은 경찰의 사명감입니까, 아니면 개인의 희생입니까?",
      "대상자가 요구사항을 당장 들어주지 않으면 뛰겠다고 시계를 보며 협박한다면?",
      "에어매트 설치가 불가능한 상황에서, 소방과 협력하여 선택할 수 있는 대안적인 안전 확보 방법은?",
      "남성이 '경찰관이 한 발자국이라도 가까이 오면 떨어지겠다'며 경계할 때, 거리를 좁히기 위한 접근 전략은?",
      "현장을 지켜보는 시민들이 스마트폰으로 촬영하며 대상자의 흥분을 가중시킨다면 어떻게 통제하겠습니까?",
      "대화 중 남성이 잠시 한눈을 파는 틈이 생겼습니다. 무리하게 덮쳐서 제압할 것인지 판단 기준은 무엇입니까?",
      "구조된 대상자가 이후 정신병원 응급입원을 거부하며 귀가를 강력히 주장할 경우 어떻게 처리해야 합니까?"
    ]
  },
  { 
    id: 6, 
    title: "자녀가 가정폭력을 신고한 상황", 
    content: "21세 자녀가 아버지는 어머니가 외도를 하여 너무 화가 나고 슬프다며 울분을 토하고 있다. 어머니는 아버지로부터 폭행을 당하여 뺨이 부은 상태로서 자신의 잘못으로 남편이 화가난 것이니 경찰에게 그냥 돌아가라고 한다. 현장 경찰관으로서 출동하였을 때 어떻게 조치를 할 것인지 발표하시오.",
    followups: [
      "진술청취는 어떤 방식으로 할 것인지?",
      "남편이 분리조치를 거부한다면 어떻게 할 것인가?",
      "긴급응급조치에는 어떤 것이 있는가?",
      "긴급출입에 대한 법적 근거 말해보아라.",
      "스마트워치가 매우 다양하게 쓰이는데, 해당 사례에서 스마트워치가 필요한 이유는 무엇인가?",
      "피해자인 어머니가 처벌을 원치 않는다며 진술조서 작성을 피한다면, 어떻게 할 것인지?",
      "만약 어머니의 목이 졸린 자국이 발견되었다면, 현장 조치나 사안의 중대성이 어떻게 달라져야 하는지?",
      "신고자가 보복을 두려워할 수 있다, 성인인 자녀에 대한 신변 보호와 심리적 안정 조치는 어떻게 할래?",
      "가해자인 아버지가 경찰관의 가슴을 밀치고 욕설을 하며 난동을 부린다면 대응방안은?",
      "가해자가 쌍방 폭행을 주장하며 피해자를 처벌해달라고 한다, 어떻게 조치할 것인지?",
      "가해자와 분리조치 후 피해자에게 할 수 있는 제도나 권리는 무엇이 있는지?",
      "분리 조치를 하는 도중 남편이 흉기를 들고나와 출입구를 막아선다면 어떤 조치를 취할 것인가?"
    ]
  },
  { 
    id: 7, 
    title: "가정폭력 신고를 받고 출동한 상황", 
    content: "가정폭력을 신고를 받고 출동을 하였는데 아내는 '부부끼리 조금 다툰 것'이라며 남편의 처벌을 원하지 않는다고 진술하고 있다. 아내의 얼굴엔 상해의 흔적이 뚜렷하며 집안의 집기도 대부분 손상된 상태이다. 이 때 출동한 경찰관으로써 해야할 조치는 무엇인지 발표해보시오.",
    followups: [
      "가정폭력 현장에는 아동이 있는 경우가 많다. 아동이 현장에 있었다면 어떤 조치나 행동을 할 건지?",
      "남편이 흉기를 들고 대항한다면 대처는?",
      "피해자를 보호하기 위해 할 수 있는 조치 생각나는 대로 말해보아라.",
      "아내랑 남편 둘 다 집으로 들어오지 말라고 한다. 어떻게 대처 할 건가?",
      "아내가 신고해놓고 출동하니까 신고 취소한다고 한다. 어떻게 대처 할 건지?",
      "남편이 지켜보는 앞에서 아내가 눈치를 보며 진술을 축소하는 것 같다.어떻게 두 사람을 자연스럽게 떼어놓고 아내의 솔직한 진술을 확보할 건가?",
      "아내가 병원 치료나 사진 촬영을 거부하고 있다. 상해 증거 확보와 피해자 구호 조치를 어떻게 병행할래?",
      "남편이 본인이 피해자라고 억울함을 호소하고 있다면, 현장에서 어떻게 진위를 확인할 것인가?",
      "현장 경찰관의 판단으로 볼 때 추가 폭행의 위험이 높은데, 강제로 두 사람을 떼어놓을 법적 근거는?",
      "신고 이력을 확인해 보니 재발우려가정이다. 경찰관으로서 현장 조치를 어떻게 할 것인가?",
      "불안해하는 아내를 안심시키고 진정시키기 위해서 어떻게 할 것인지 말해보아라.",
      "아내가 완강한 거부로 철수하게 될 경우, 나중에 도움 받을 수 있는 방법을 말해보아라"
    ]
  },
  { 
    id: 8, 
    title: "이상동기 범죄", 
    content: "14시경 시장 부근에서 키 190cm, 험악하게 생긴 40대 후반 남성이 술에 취한 채 낫을 들고 돌아다니면서 인근 시민들의 물건을 던지면서 '죽여버릴거야'라고 말하며 돌아다니고 있다. 신고를 받고 출동했을 때 현장경찰관으로서 어떻게 대처할지 발표하시오.",
    followups: [
      "신고를 받고 출동 했는데 남성이 손에 흉기를 들고 있지 않고 있으면 어떻게 할 건지?",
      "무작정 체포를 하는 게 맞는 건지?",
      "불심검문 요건?",
      "현재 상황에서 경찰관이 가장 중요시 여기는 것은 무엇인가?",
      "시장이면 주변에 상인과 시민들이 많을 거 같은데 어떻게 대처할래?",
      "출동 경찰관은 수험생과 사수 두 명 뿐이다. 어떻게 대처할 것인지?",
      "어떤 방식으로 자극하지 않고 빠르게 상황을 마무리 할 것인지 말해보아라.",
      "경찰이 투항 경고를 했음에도 낫을 휘두르며 다가오면 어떻게 할 것인지?",
      "테이저건이나 총기를 사용한다면 어떤 기준과 절차에 맞게 사용해야 하는지?",
      "흉기에 찔려 피해자가 있는 상황이다 어떻게 대처할 것인지?",
      "남성이 경찰을 발견하자 낫을 던지고 시장 골목길로 도주했다 어떻게 할래?",
      "주변 시민들이 스마트폰으로 촬영하며 통제를 따르지 않는다면 어떻게 대처할 것인지?"
    ]
  }
];

// 2. 인성면접 10개 카테고리별 질문 풀
const PERSONALITY_POOLS = [
  [
    { q: "본인이 생각하는 '청렴성'을 갖춘 인물과 그 이유는?", tail: ["본인은 그 인물과 비교했을 때 어떤 점이 부족한가요?", "경찰에게 청렴성이 유독 강조되는 이유는 무엇일까요?", "상사가 청렴하지 못한 지시를 내린다면 어떻게 하겠습니까?"] },
    { q: "살면서 가장 중요하게 생각하는 가치관은 무엇입니까?", tail: ["그 가치관 때문에 손해를 본 경험이 있나요?", "경찰 업무와 그 가치관이 충돌한다면 어떻게 하겠습니까?", "본인의 가치관을 다른 사람에게 강요한 적은 없나요?"] },
    { q: "원칙과 융통성 중 경찰에게 더 필요한 것은 무엇입니까?", tail: ["본인이 융통성을 발휘해 문제를 해결한 경험이 있나요?", "지나친 융통성으로 인해 발생할 수 있는 부작용은 무엇입니까?"] },
    { q: "동료의 사소한 비위를 목격한다면 어떻게 하겠습니까?", tail: ["친한 동료라도 똑같이 행동할 수 있습니까?", "동료가 역으로 화를 낸다면 어떻게 설득할 건가요?"] },
    { q: "공과 사를 구분하여 행동한 경험을 말해보세요.", tail: ["당시 주변 사람들의 반응은 어땠나요?"] }
  ],
  [
    { q: "조직 내에서 갈등이 발생했을 때 본인만의 해결 노하우는?", tail: ["본인의 의견만 굽히면서 해결한 건 아닌가요?", "끝까지 갈등이 좁혀지지 않는다면 어떻게 하겠습니까?", "감정적인 다툼으로 번진 적은 없었나요?"] },
    { q: "세대 차이가 나는 상사와 함께 근무하게 된다면?", tail: ["상사의 불합리한 지시도 무조건 따를 것인가요?", "요즘 신임 경찰관들의 특징이 무엇이라고 생각하나요?"] },
    { q: "본인과 성향이 전혀 맞지 않는 동료와 순찰차를 타야 한다면?", tail: ["침묵이 유지된다면 먼저 어떤 대화를 시도하겠습니까?"] },
    { q: "팀 프로젝트 중 무임승차하는 팀원을 대처해 본 경험이 있나요?", tail: ["그 팀원을 결국 포용했나요, 아니면 배제했나요?", "경찰 조직 내에도 그런 직원이 있다면 어떻게 하겠습니까?"] },
    { q: "리더형인가요, 팔로워형인가요?", tail: ["반대 성향의 역할을 맡았을 때 겪었던 어려움은 없었나요?"] }
  ],
  [
    { q: "할머니를 도와드린 후 보호자가 준 음료를 상사가 이미 마셨다면?", tail: ["상사에게 직접 법 위반이라고 말할 수 있습니까?", "보호자가 억지로 주머니에 찔러 넣고 도망갔다면?", "그 음료수가 만약 고가의 상품권이었다면 똑같이 행동할 건가요?"] },
    { q: "친구가 음주운전 단속에 걸려 봐달라고 부탁한다면?", tail: ["친구가 평생 인연을 끊자고 해도 단속할 건가요?"] },
    { q: "순찰 중 배가 너무 고픈데, 식당 주인이 무료로 밥을 주겠다고 한다면?", tail: ["돈을 지불하려고 해도 식당 주인이 극구 거절한다면 어떻게 할 건가요?"] },
    { q: "수배 중인 범인이 가족의 장례식장에 나타났다는 첩보를 들었다면?", tail: ["인륜과 법 집행 사이에서 갈등해 본 경험이 있나요?"] },
    { q: "개인적인 약속 시간에 늦었는데 무단횡단 할 것인가요?", tail: ["경찰관이 되기 전 사소한 기초질서 위반 경험이 있나요?"] }
  ],
  [
    { q: "살면서 가장 큰 실패를 겪었던 경험과 극복 과정은?", tail: ["그 실패를 통해 배운 점을 경찰 업무에 어떻게 적용할 건가요?", "다시 돌아간다면 다르게 행동할 부분이 있나요?", "그 실패가 본인의 자존감에 영향을 미치지는 않았나요?"] },
    { q: "본인만의 스트레스 해소법은 무엇입니까?", tail: ["근무 중 극심한 스트레스를 받으면 당장 어떻게 해소할 건가요?"] },
    { q: "악성 민원인이 욕설을 하며 난동을 부린다면?", tail: ["민원인이 본인의 부모님을 모욕해도 참을 수 있습니까?"] },
    { q: "예상치 못한 돌발 상황에 침착하게 대응했던 경험이 있나요?", tail: ["당시 가장 당황스러웠던 포인트는 무엇이었나요?"] },
    { q: "노력한 만큼 결과가 나오지 않아 좌절했던 적이 있나요?", tail: ["경찰 승진 시험에서 계속 떨어진다면 어떻게 하겠습니까?"] }
  ],
  [
    { q: "말이 통하지 않는 사람을 설득해 본 경험이 있습니까?", tail: ["끝내 설득하지 못했다면 원인이 무엇이었다고 생각하나요?", "설득하는 과정에서 가장 중요하게 생각한 것은 무엇인가요?"] },
    { q: "본인의 의사소통 방식의 장점과 단점은 무엇입니까?", tail: ["그 단점 때문에 오해를 샀던 적이 있나요?"] },
    { q: "경찰의 '치안 서비스'란 무엇이라고 생각합니까?", tail: ["서비스업과 경찰 업무의 차이는 무엇인가요?"] },
    { q: "피해자의 슬픔에 깊이 공감해 본 경험이 있나요?", tail: ["공감과 객관적 수사 사이의 균형을 어떻게 맞출 건가요?"] },
    { q: "자신을 오해하는 사람의 마음을 돌린 적이 있나요?", tail: ["어떤 구체적인 행동이 그 사람의 마음을 열었나요?"] }
  ],
  [
    { q: "남들이 꺼려하는 궂은 일을 자진해서 해본 경험이 있나요?", tail: ["왜 굳이 본인이 그 일을 하려고 했나요?", "결과적으로 본인에게 이득이 된 부분이 있었나요?", "다시 그런 상황이 오면 또 나설 것인가요?"] },
    { q: "책임을 회피하는 동료를 본 적이 있나요? 어떻게 대처했나요?", tail: ["본인이 그 책임을 억울하게 떠맡은 적은 없었나요?"] },
    { q: "주도적으로 아이디어를 내어 문제를 개선해 본 경험은?", tail: ["기존 방식을 고집하는 사람들의 반발은 없었나요?"] },
    { q: "주어진 업무의 범위를 넘어서 추가적인 노력을 한 적이 있나요?", tail: ["상사가 시키지도 않은 일을 해서 혼난 적은 없나요?"] },
    { q: "경찰관으로서 가져야 할 '사명감'이란 구체적으로 무엇인가요?", tail: ["사명감이 식어갈 때 어떻게 다시 불태울 것인가요?"] }
  ],
  [
    { q: "본인의 가장 치명적인 단점은 무엇입니까?", tail: ["그 단점이 경찰 업무에 어떤 부정적 영향을 미칠까요?", "현재 그 단점을 고치기 위해 어떤 구체적인 노력을 하고 있나요?", "동료들이 그 단점을 지적한다면 어떻게 반응할 건가요?"] },
    { q: "주변 친구들은 본인을 어떤 사람이라고 평가하나요?", tail: ["그 평가 중 본인이 동의하지 않는 부분도 있나요?"] },
    { q: "살면서 가장 후회되는 선택은 무엇입니까?", tail: ["지금 그 선택을 할 기회가 다시 온다면 어떻게 하겠습니까?"] },
    { q: "타인의 비판을 수용해서 본인을 변화시킨 경험이 있나요?", tail: ["처음 비판을 들었을 때 방어적인 태도는 없었나요?"] },
    { q: "경찰이라는 직업이 본인의 성격과 맞지 않는다고 느낀 적이 있나요?", tail: ["그럼에도 불구하고 지원한 이유는 무엇인가요?"] }
  ],
  [
    { q: "최근 가장 관심 있게 본 사회적 이슈와 그에 대한 본인의 생각은?", tail: ["그 이슈와 경찰 업무는 어떤 연관이 있나요?", "본인과 다른 의견을 가진 사람을 어떻게 설득할 수 있나요?"] },
    { q: "촉법소년 연령 하향에 대한 본인의 찬반 의견은?", tail: ["반대(혹은 찬성) 측의 가장 타당한 주장은 무엇이라고 생각하나요?"] },
    { q: "경찰의 공권력이 약하다는 지적에 대해 어떻게 생각하나요?", tail: ["공권력을 강화했을 때 발생할 수 있는 부작용은 없을까요?"] },
    { q: "CCTV 확대 설치가 사생활 침해라는 주장에 대한 생각은?", tail: ["본인의 집 앞에 CCTV가 설치되어도 찬성할 건가요?"] },
    { q: "최근 경찰 비위 뉴스를 보고 느낀 점은?", tail: ["본인은 절대 그런 유혹에 빠지지 않을 거라고 확신하나요?"] }
  ],
  [
    { q: "가장 억울했던 경험과 그것을 어떻게 대처했는지 말해보세요.", tail: ["억울함을 풀지 못하고 넘어간 적도 있나요?", "그 경험으로 인해 사람을 대하는 태도가 바뀌었나요?"] },
    { q: "급격한 환경 변화에 적응해야 했던 경험이 있나요?", tail: ["적응 과정에서 가장 힘들었던 점은 무엇인가요?"] },
    { q: "다수의 의견에 혼자 반대했던 경험이 있나요?", tail: ["끝까지 본인의 의견을 관철시켰나요, 아니면 다수를 따랐나요?"] },
    { q: "친한 친구와 크게 다툰 적이 있나요? 원인과 결과는?", tail: ["먼저 사과하는 편인가요, 사과를 기다리는 편인가요?"] },
    { q: "살면서 가장 집중해서 무언가를 성취해 본 경험은?", tail: ["포기하고 싶었던 순간은 언제였고 어떻게 극복했나요?"] }
  ],
  [
    { q: "마지막으로 면접관에게 하고 싶은 말이나 질문이 있나요?", tail: [] },
    { q: "오늘 면접에서 본인의 답변 중 가장 아쉬운 부분은 무엇인가요?", tail: ["그 답변을 다시 할 기회를 드린다면 어떻게 말하겠습니까?", "면접 준비 과정에서 가장 어려웠던 점은 무엇이었나요?"] },
    { q: "경찰이 되지 않는다면 어떤 직업을 선택할 것인가요?", tail: ["그 직업과 경찰의 공통점은 무엇인가요?"] },
    { q: "지금 당장 수중에 100억이 생긴다면 경찰을 계속 할 것인가요?", tail: ["돈이 목적이 아니라면, 굳이 힘든 경찰을 하려는 이유는?"] },
    { q: "수험생활 동안 가장 도움을 준 사람에게 짧은 편지를 남겨보세요.", tail: [] }
  ]
];

type ViewMode = 'overview' | 'presentation' | 'followup' | 'review' | 'personality_active' | 'personality_review';
type InterviewType = 'presentation' | 'personality';

interface SelectedQuestion {
  id: number;
  q: string;
  assignedTailCount: number;
  tails: string[];
}

interface PersonalityAudio {
  qId: number;
  isTail: boolean;
  questionText: string;
  url: string;
}

export default function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [isError, setIsError] = useState(false);
  const [userName, setUserName] = useState<string>('');

  const [interviewType, setInterviewType] = useState<InterviewType>('personality'); 
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  
  const [secondsLeft, setSecondsLeft] = useState(180);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  const [currentTopic, setCurrentTopic] = useState(PRESENTATION_TOPICS[0]);
  const [selectedFollowups, setSelectedFollowups] = useState<string[]>([]);
  const [currentFollowupIdx, setCurrentFollowupIdx] = useState(0);
  const [presentationAudio, setPresentationAudio] = useState<string | null>(null);
  const [followupAudios, setFollowupAudios] = useState<{question: string, url: string}[]>([]);
  
  const [selectedPersonality, setSelectedPersonality] = useState<SelectedQuestion[]>([]);
  const [currentPersonalityIdx, setCurrentPersonalityIdx] = useState(0);
  const [currentTailIdx, setCurrentTailIdx] = useState(-1); 
  const [personalityAudios, setPersonalityAudios] = useState<PersonalityAudio[]>([]);

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => { 
    setupRandomPresentation(); 
    setupRandomPersonality();
  }, []);

  const setupRandomPresentation = () => {
    const randomTopic = PRESENTATION_TOPICS[Math.floor(Math.random() * PRESENTATION_TOPICS.length)];
    setCurrentTopic(randomTopic);
    const shuffled = [...randomTopic.followups].sort(() => 0.5 - Math.random());
    setSelectedFollowups(shuffled.slice(0, 5));
  };

  const setupRandomPersonality = () => {
    const newSelection: SelectedQuestion[] = PERSONALITY_POOLS.map((pool, index) => {
      const randomQ = pool[Math.floor(Math.random() * pool.length)];
      const maxTails = Math.min(randomQ.tail.length, 3);
      const randomTailCount = Math.floor(Math.random() * (maxTails + 1));
      const shuffledTails = [...randomQ.tail].sort(() => 0.5 - Math.random()).slice(0, randomTailCount);
      return { id: index + 1, q: randomQ.q, assignedTailCount: randomTailCount, tails: shuffledTails };
    });
    setSelectedPersonality(newSelection);
  };

  const handleRefresh = () => {
    if (interviewType === 'presentation') setupRandomPresentation();
    else setupRandomPersonality();
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (AUTHORIZED_USERS[passwordInput]) {
      setUserName(AUTHORIZED_USERS[passwordInput]);
      setIsAuthorized(true);
    } else {
      setIsError(true);
      setTimeout(() => setIsError(false), 2000);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isTimerRunning && secondsLeft > 0) {
      timer = setInterval(() => setSecondsLeft(prev => prev - 1), 1000);
    } else if (secondsLeft === 0 && isTimerRunning) {
      if (viewMode === 'presentation' || viewMode === 'followup') handleCompleteStep();
      else if (viewMode === 'personality_active') handlePersonalityComplete();
    }
    return () => { if (timer) clearInterval(timer); };
  }, [isTimerRunning, secondsLeft, viewMode]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) { console.error(err); }
  };

  const handleQuitInterview = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.onstop = null; 
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      setIsRecording(false);
    }
    setIsTimerRunning(false);
    setViewMode('overview'); 
  };

  const handleCompleteStep = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        if (viewMode === 'presentation') setPresentationAudio(url);
        else setFollowupAudios(prev => [...prev, { question: selectedFollowups[currentFollowupIdx], url }]);
      };
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      setIsRecording(false);
    }
    setIsTimerRunning(false);
    setTimeout(() => {
      if (viewMode === 'presentation') {
        setViewMode('followup');
        setCurrentFollowupIdx(0);
        setSecondsLeft(60);
        setIsTimerRunning(true);
        startRecording();
      } else if (viewMode === 'followup') {
        if (currentFollowupIdx < selectedFollowups.length - 1) {
          setCurrentFollowupIdx(prev => prev + 1);
          setSecondsLeft(60);
          setIsTimerRunning(true);
          startRecording();
        } else {
          setViewMode('review');
        }
      }
    }, 500);
  };

  const handlePersonalityComplete = () => {
    const currentQ = selectedPersonality[currentPersonalityIdx];
    const isTail = currentTailIdx >= 0;
    const qText = isTail ? currentQ.tails[currentTailIdx] : currentQ.q;
    const qId = currentQ.id;

    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setPersonalityAudios(prev => [...prev, { qId, isTail, questionText: qText, url }]);
      };
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      setIsRecording(false);
    }

    setIsTimerRunning(false);
    setTimeout(() => {
      if (currentTailIdx < currentQ.assignedTailCount - 1) {
        setCurrentTailIdx(prev => prev + 1);
        setSecondsLeft(60);
        setIsTimerRunning(true);
        startRecording();
      } else {
        if (currentPersonalityIdx < selectedPersonality.length - 1) {
          setCurrentPersonalityIdx(prev => prev + 1);
          setCurrentTailIdx(-1);
          setSecondsLeft(60);
          setIsTimerRunning(true);
          startRecording();
        } else {
          setViewMode('personality_review');
        }
      }
    }, 500);
  };

  const startInterview = () => {
    if (interviewType === 'presentation') {
      setPresentationAudio(null);
      setFollowupAudios([]);
      setSecondsLeft(180);
      setViewMode('presentation');
      setIsTimerRunning(true);
      startRecording();
    } else {
      setPersonalityAudios([]);
      setCurrentPersonalityIdx(0);
      setCurrentTailIdx(-1);
      setSecondsLeft(60); 
      setViewMode('personality_active');
      setIsTimerRunning(true);
      startRecording();
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 antialiased">
        <div className="max-w-sm w-full space-y-8 text-center">
          <div className="flex justify-center">
            <div className="p-4 bg-slate-50 rounded-full border border-slate-100"><Lock className="w-10 h-10 text-slate-400" /></div>
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-950 tracking-tighter uppercase">Authorized Access</h1>
            <p className="text-slate-500 text-sm mt-2 font-medium">관리자에게 발급받은 접속 코드를 입력하세요.</p>
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="Access Code" className={`w-full px-5 py-4 bg-slate-50 border ${isError ? 'border-red-500 animate-shake' : 'border-slate-200'} rounded-2xl text-center text-2xl font-bold text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-300 tracking-widest`} />
            <button className="w-full bg-slate-950 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-lg">면접장 입장하기</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-100">
      {viewMode === 'overview' && (
        <main className="max-w-md mx-auto flex flex-col min-h-screen pb-32 bg-white shadow-xl shadow-slate-100/50">
          <div className="p-5 pt-8 space-y-4 bg-white sticky top-0 z-10 border-b border-slate-50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-slate-500">환영합니다, <span className="text-slate-900">{userName}</span>님!</span>
            </div>
            <div className="flex justify-between items-center pl-1">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">면접 모드 선택</div>
              <button onClick={handleRefresh} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-lg transition-colors active:scale-95">
                <RefreshCw className="w-3.5 h-3.5" /> <span className="text-[10px] font-bold">문항 재설정</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setInterviewType('presentation')} className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all duration-300 ${interviewType === 'presentation' ? 'bg-white border-blue-500 shadow-lg shadow-blue-100' : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100'}`}>
                <Megaphone className={`w-8 h-8 mb-3 ${interviewType === 'presentation' ? 'text-blue-500' : 'text-slate-300'}`} />
                <div className={`font-black text-lg ${interviewType === 'presentation' ? 'text-blue-600' : 'text-slate-400'}`}>발표면접</div>
              </button>
              <button onClick={() => setInterviewType('personality')} className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all duration-300 ${interviewType === 'personality' ? 'bg-white border-indigo-500 shadow-lg shadow-indigo-100' : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100'}`}>
                <UserCheck className={`w-8 h-8 mb-3 ${interviewType === 'personality' ? 'text-indigo-500' : 'text-slate-300'}`} />
                <div className={`font-black text-lg ${interviewType === 'personality' ? 'text-indigo-600' : 'text-slate-400'}`}>인성면접</div>
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4 px-6 my-4">
            <div className="h-[1px] bg-slate-100 flex-1"></div>
            <div className="text-[11px] font-black text-slate-300 flex items-center gap-1.5 uppercase tracking-widest">
              {interviewType === 'presentation' ? '1문항 + 맞춤 꼬리 5개 출제' : '10문항 + 0~3개 꼬리 출제'}
            </div>
            <div className="h-[1px] bg-slate-100 flex-1"></div>
          </div>
          
          <div className="px-5 space-y-3 mt-2 flex-grow">
            {interviewType === 'personality' ? (
              selectedPersonality.map((q) => (
                <div key={q.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-md transition-all shadow-sm">
                  <div className="flex gap-4 items-start">
                    <div className="bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-xs px-2.5 py-1 rounded shrink-0 font-mono">Q.{q.id.toString().padStart(2, '0')}</div>
                    <div className="space-y-2 pt-0.5 w-full">
                      <div className="text-slate-700 text-sm leading-relaxed font-bold">{q.q}</div>
                      {q.assignedTailCount > 0 ? (
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-50 border border-slate-100 rounded-md"><RotateCcw className="w-3 h-3 text-indigo-400" /><span className="text-slate-500 text-[10px] font-bold">꼬리질문 {q.assignedTailCount}개 대기중</span></div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-50 border border-slate-100 rounded-md"><CheckCircle2 className="w-3 h-3 text-slate-300" /><span className="text-slate-400 text-[10px] font-bold">단독 질문</span></div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl shadow-slate-100/50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600"></div>
                <div className="pl-3">
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <h2 className="text-lg font-bold text-slate-950 leading-snug pr-2">{currentTopic.title}</h2>
                  </div>
                  <div className="mb-4">
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-50 border border-slate-100 rounded-md"><RotateCcw className="w-3 h-3 text-blue-400" /><span className="text-slate-500 text-[10px] font-bold">맞춤 꼬리질문 5개 대기중</span></div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-5 text-slate-700 leading-relaxed text-sm h-[260px] overflow-y-auto border border-slate-100 italic">{currentTopic.content}</div>
                </div>
              </div>
            )}
          </div>
          <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-white via-white to-transparent pointer-events-none">
            <div className="max-w-md mx-auto pointer-events-auto">
              <button onClick={startInterview} className={`w-full py-5 rounded-2xl font-black text-xl shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${interviewType === 'personality' ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'}`}>
                {interviewType === 'personality' ? '인성면접 시작하기' : '발표면접 시작하기'}
              </button>
            </div>
          </div>
        </main>
      )}

      {/* 발표면접 진행 화면 */}
      {viewMode === 'presentation' && (
        <main className="max-w-lg mx-auto min-h-screen bg-white p-8 flex flex-col shadow-2xl">
          <div className="flex justify-between items-center mb-8 border-b border-slate-50 pb-4">
            <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-widest animate-pulse"><div className="w-2 h-2 bg-red-600 rounded-full" /> Recording</div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest font-mono">Phase 01</span>
              <button onClick={handleQuitInterview} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"><Home className="w-5 h-5" /></button>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-slate-950 mb-4">{currentTopic.title}</h2>
            <p className="text-sm text-slate-700 leading-relaxed max-h-[220px] overflow-y-auto pr-2">{currentTopic.content}</p>
          </div>
          <div className="flex-grow flex flex-col items-center justify-center">
             <div className="text-[110px] font-mono font-bold text-blue-600 tracking-tighter leading-none tabular-nums">{formatTime(secondsLeft)}</div>
             <div className="w-full h-1.5 bg-slate-100 rounded-full mt-12 overflow-hidden max-w-[280px] mx-auto"><div className="h-full bg-blue-600 transition-all duration-1000 ease-linear" style={{width: `${(secondsLeft/180)*100}%`}}></div></div>
          </div>
          <button onClick={handleCompleteStep} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg shadow-lg mt-6">답변 완료</button>
        </main>
      )}

      {/* 발표면접 꼬리질문 화면 */}
      {viewMode === 'followup' && (
        <main className="max-w-md mx-auto min-h-screen bg-white p-10 flex flex-col justify-center shadow-2xl">
          <div className="mb-12 flex justify-between items-center w-full">
             <div className="text-blue-700 font-bold text-sm tracking-widest uppercase font-mono flex items-center gap-2">Follow-up {currentFollowupIdx + 1} / {selectedFollowups.length} <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" /></div>
             <button onClick={handleQuitInterview} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"><Home className="w-5 h-5" /></button>
          </div>
          <h2 className="text-2xl font-bold mb-20 leading-snug text-slate-950">"{selectedFollowups[currentFollowupIdx]}"</h2>
          <div className="flex items-center gap-6 mb-24">
            <span className="text-6xl font-mono font-bold text-blue-600 tabular-nums">{formatTime(secondsLeft)}</span>
            <div className="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner"><div className="h-full bg-blue-600 transition-all duration-1000" style={{width: `${(secondsLeft/60)*100}%`}}></div></div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-auto">
            <button onClick={handleCompleteStep} className="bg-slate-100 text-slate-500 py-4 rounded-xl font-bold text-sm hover:bg-slate-200">건너뛰기</button>
            <button onClick={handleCompleteStep} className="bg-blue-600 text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-blue-100">답변 완료</button>
          </div>
        </main>
      )}

      {/* 발표면접 리뷰 화면 */}
      {viewMode === 'review' && (
        <main className="max-w-2xl mx-auto px-6 py-12 space-y-10 bg-white min-h-screen">
          <div className="text-center mb-10 space-y-4">
            <div className="inline-block p-4 bg-blue-50 rounded-full border border-blue-100"><ShieldCheck className="w-10 h-10 text-blue-600" /></div>
            <h1 className="text-3xl font-black text-slate-950 tracking-tighter uppercase">Presentation Review</h1>
          </div>
          <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 space-y-4 shadow-sm">
            <div className="font-bold text-slate-900 text-lg leading-tight">{currentTopic.title}</div>
            <audio src={presentationAudio || ''} controls className="w-full h-12" />
          </div>
          {followupAudios.length > 0 && (
            <div className="space-y-4 pt-6">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Follow-up Records</div>
              {followupAudios.map((audio, i) => (
                <div key={i} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4 hover:border-blue-200 transition-all">
                  <div className="text-sm font-bold flex gap-4 text-slate-950 leading-relaxed"><span className="text-blue-600 shrink-0 font-black">Q{i+1}.</span><span>{audio.question}</span></div>
                  <audio src={audio.url} controls className="w-full h-10 opacity-90" />
                </div>
              ))}
            </div>
          )}
          <button onClick={() => setViewMode('overview')} className="w-full bg-slate-950 text-white py-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-black transition-all mt-12 shadow-xl shadow-slate-200"><RotateCcw className="w-5 h-5" /> 처음 화면으로 이동</button>
        </main>
      )}

      {/* 인성면접 진행 및 리뷰 화면 (간략화된 예시, 기존 로직 유지) */}
      {viewMode === 'personality_active' && (
        <main className="max-w-md mx-auto min-h-screen bg-white p-10 flex flex-col justify-center shadow-2xl border-t-8 border-indigo-600">
          <div className="mb-12 flex justify-between items-center w-full">
            <div className="text-indigo-600 font-bold text-sm tracking-widest uppercase font-mono flex items-center gap-2">
              {currentTailIdx === -1 
                ? `Q.${String(currentPersonalityIdx + 1).padStart(2, '0')} 메인 질문` 
                : `Q.${String(currentPersonalityIdx + 1).padStart(2, '0')} 꼬리질문 ${currentTailIdx + 1}`}
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse ml-2" />
            </div>
            <button onClick={handleQuitInterview} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"><Home className="w-5 h-5" /></button>
          </div>
          <h2 className="text-2xl font-bold mb-20 leading-snug text-slate-950">
            "{currentTailIdx === -1 ? selectedPersonality[currentPersonalityIdx].q : selectedPersonality[currentPersonalityIdx].tails[currentTailIdx]}"
          </h2>
          <div className="flex items-center gap-6 mb-24">
            <span className="text-6xl font-mono font-bold text-indigo-600 tabular-nums">{formatTime(secondsLeft)}</span>
            <div className="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner"><div className="h-full bg-indigo-600 transition-all duration-1000" style={{width: `${(secondsLeft/60)*100}%`}}></div></div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-auto">
            <button onClick={handlePersonalityComplete} className="bg-slate-100 text-slate-500 py-4 rounded-xl font-bold text-sm hover:bg-slate-200">건너뛰기</button>
            <button onClick={handlePersonalityComplete} className="bg-indigo-600 text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100">답변 완료</button>
          </div>
        </main>
      )}

      {viewMode === 'personality_review' && (
        <main className="max-w-2xl mx-auto px-6 py-12 space-y-8 bg-white min-h-screen">
          <div className="text-center mb-10 space-y-4">
            <div className="inline-block p-4 bg-indigo-50 rounded-full border border-indigo-100"><ShieldCheck className="w-10 h-10 text-indigo-600" /></div>
            <h1 className="text-3xl font-black text-slate-950 tracking-tighter uppercase">Personality Review</h1>
          </div>
          <div className="space-y-6">
            {selectedPersonality.map((q) => {
              const relatedAudios = personalityAudios.filter(audio => audio.qId === q.id);
              if (relatedAudios.length === 0) return null;
              return (
                <div key={q.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded">Q.{q.id.toString().padStart(2, '0')}</span>
                  </div>
                  {relatedAudios.map((audio, idx) => (
                    <div key={idx} className={`space-y-3 ${audio.isTail ? 'pl-4 border-l-2 border-indigo-100 ml-2 mt-4' : ''}`}>
                      <div className="text-sm font-bold text-slate-900 leading-relaxed flex gap-2">
                        {audio.isTail && <RotateCcw className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />}
                        <span>{audio.questionText}</span>
                      </div>
                      <audio src={audio.url} controls className="w-full h-10 opacity-90" />
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
          <button onClick={() => setViewMode('overview')} className="w-full bg-slate-950 text-white py-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-black transition-all mt-12 shadow-xl shadow-slate-200"><RotateCcw className="w-5 h-5" /> 처음 화면으로 이동</button>
        </main>
      )}
    </div>
  );
}