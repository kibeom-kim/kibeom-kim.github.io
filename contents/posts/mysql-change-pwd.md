---
title: MySQL 8.0 계정의 비밀번호 변경하기
date: 2025-04-02
update: 2025-04-02
tags: 
    - mysql
    - change password
---

> 아래 과정을 사내 위키에도 작성하였지만 기록으로 남겨두고 싶어 재 작성합니다. 
{: .prompt-info }

개발팀 내부에서 사용하는 mysql계정의 비밀번호를 변경해야 하는 경우가 생겼습니다.

유관 부서에 확인하여 처리해야하는 번거로움은 있지만 작업 자체의 난이도가 높아보이진 않았습니다. 

비교적 최근에 <u>Real MySQL 8.0 1권</u>[^1]을 읽었던 터라 8.0 부터는 dual password를 지원하고 이를 통해 계정의 비밀번호를 변경할 수 있다는 사실을 알고 있었습니다.

정확한 내용 확인을 위해 홈페이지에서도 내용[^2]을 찾아보았습니다. 

이중 비밀번호 기능을 활용하면 긴밀한 협력이나 다운타임 없이 비밀번호를 변경할 수 있다고 합니다. 
 
<blockquote>
With dual passwords, credential changes can be made more easily, in phases, without requiring close cooperation, and without downtime:
<br>이중 비밀번호를 통해 긴밀한 협력이나 다운타임 없이 자격 증명 변경이 쉽게 이루어질 수 있습니다.<br><br>


1. For each affected account, establish a new primary password on the servers, retaining the current password as the secondary password. This enables servers to recognize either the primary or secondary password for each account, while applications can continue to connect to the servers using the same password as previously (which is now the secondary password).<br>
1. 영향을 받는 각 계정에 대해 서버에 새 기본 비밀번호를 설정하고 현재 비밀번호를 보조 비밀번호로 유지합니다. 이를 통해 서버는 각 계정의 기본 또는 보조 비밀번호를 인식할 수 있으며, 어플리케이션은 현재는 보조 비밀번호가 된 이전과 같은 비밀번호를 사용하여 계속해서 서버에 연결할 수 있습니다.<br><br>

2. After the password change has propagated to all servers, modify applications that use any affected account to connect using the account primary password.<br>
2. 암호 변경 사항이 모든 서버에 전파된 후, 영향을 받는 계정을 사용하는 어플리케이션을 수정하여 계정의 기본 비밀번호를 사용하여 연결합니다.<br><br>

3. After all applications have been migrated from the secondary passwords to the primary passwords, the secondary passwords are no longer needed and can be discarded. After this change has propagated to all servers, only the primary password for each account can be used to connect. The credential change is now complete.<br>
3. 모든 애플리케이션이 보조 비밀번호에서 기본 비밀번호로 변경된 후에는 보조 비밀번호는 더 이상 필요하지 않으며 삭제할 수 있습니다. 이 변경 사항이 모든 서버에 전파되면, 각 계정의 기본 비밀번호만 사용하여 연결할 수 있습니다.
</blockquote>

쉽게 생각하면 swap하는 과정과도 비슷한 하다고 느껴집니다. 

비밀번호 변경 자체는 매뉴얼에서 제안해준대로 하면 어려움 없이 진행할 수 있습니다.

매뉴얼에는 현재 비밀번호를 보조로 변경하고 새로운 기본 비밀번호를 등록하는 방법, 보조 비밀번호를 삭제하는 방법, 랜덤 비밀번호를 생성하는 방법이 있습니다.

```sql
-- 이중 비밀번호 설정
ALTER USER 'appuser1'@'host1.example.com'
IDENTIFIED BY 'password_b'
RETAIN CURRENT PASSWORD;
```

```sql
-- 보조 비밀번호 삭제
ALTER USER 'appuser1'@'host1.example.com'
DISCARD OLD PASSWORD;
```

원하던 것은 랜덤한 새로운 비밀번호를 생성하고 이를 기본 비밀번호(현재 비밀번호를 보조 비밀번호로 유지)로 등록하는 것입니다. 

이에 대한 내용이 따로 없지만 두 구문을 조합할 수 있을 것 같아 아래와 같은 구문을 개발환경에서 실행해보았습니다.

```sql
ALTER USER
'username'@'host' IDENTIFIED BY RANDOM PASSWORD
RETAIN CURRENT PASSWORD;
```

위 쿼리를 통해 원하는 계정에 랜덤 비밀번호를 추가하고 현재 비밀번호는 보조 비밀번호로 잘 변경되고 연결되는 것도 확인하였습니다.

---
[^1]: https://product.kyobobook.co.kr/detail/S000001766482
[^2]: https://dev.mysql.com/doc/refman/8.4/en/password-management.html#dual-passwords