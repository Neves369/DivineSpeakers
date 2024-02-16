export const getAndroidVersion = async () => {

    let storeURL = 'https://play.google.com/store/apps/details?id=com.neves369.divinespeakers'

    const response = await fetch(storeURL).then((r) => {
        if (r.status === 200) {
            return r.text();
        }
        throw new Error('URL inválida.');
    });
    // const matches = response.match(/<span class="htlgb"><div class="IQ1z0d"><span class="htlgb">([0-9]+\.?[0-9]*\.?[0-9]*)<\/span><\/div><\/span>/);
    const matches = response.match(/\[\[\[['"]((\d+\.)+\d+)['"]\]\],/);
    if (!matches) {
        throw new Error('Não foi possível recuperar a versão atual do app na playstore.');
    }
    return matches[1];
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5kcm9pZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9hbmRyb2lkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sQ0FBQyxNQUFNLGlCQUFpQixHQUFHLEtBQUssRUFBRSxXQUFtQixFQUFFLEVBQW1CLEVBQUU7SUFDaEYsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsdUVBQXVFLENBQUMsRUFBRTtRQUM1RixNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7S0FDaEQ7SUFFRCxNQUFNLFFBQVEsR0FBRyxNQUFNLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtRQUNoRCxJQUFJLENBQUMsQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFFO1lBQ3BCLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ2pCO1FBRUQsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0lBQ2pELENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQywrR0FBK0csQ0FBQyxDQUFDO0lBRWhKLElBQUksQ0FBQyxPQUFPLEVBQUU7UUFDWixNQUFNLElBQUksS0FBSyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7S0FDcEQ7SUFFRCxPQUFPLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgZ2V0QW5kcm9pZFZlcnNpb24gPSBhc3luYyAoc3RvcmVVUkw6IHN0cmluZyA9ICcnKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgaWYgKCFzdG9yZVVSTC5tYXRjaCgvXmh0dHBzPzpcXC9cXC9wbGF5XFwuZ29vZ2xlXFwuY29tXFwvc3RvcmVcXC9hcHBzXFwvZGV0YWlsc1xcP2lkPVswLTlhLXpBLVouXSsvKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignYW5kcm9pZFN0b3JlVVJMIGlzIGludmFsaWQuJyk7XG4gIH1cblxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHN0b3JlVVJMKS50aGVuKChyKSA9PiB7XG4gICAgaWYgKHIuc3RhdHVzID09PSAyMDApIHtcbiAgICAgIHJldHVybiByLnRleHQoKTtcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2FuZHJvaWRTdG9yZVVSTCBpcyBpbnZhbGlkLicpO1xuICB9KTtcblxuICBjb25zdCBtYXRjaGVzID0gcmVzcG9uc2UubWF0Y2goLzxzcGFuIGNsYXNzPVwiaHRsZ2JcIj48ZGl2IGNsYXNzPVwiSVExejBkXCI+PHNwYW4gY2xhc3M9XCJodGxnYlwiPihbMC05XStcXC4/WzAtOV0qXFwuP1swLTldKik8XFwvc3Bhbj48XFwvZGl2PjxcXC9zcGFuPi8pO1xuXG4gIGlmICghbWF0Y2hlcykge1xuICAgIHRocm93IG5ldyBFcnJvcignY2FuXFwndCBnZXQgYW5kcm9pZCBhcHAgdmVyc2lvbi4nKTtcbiAgfVxuXG4gIHJldHVybiBtYXRjaGVzWzFdO1xufTtcbiJdfQ==