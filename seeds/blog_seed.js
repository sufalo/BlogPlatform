exports.seed = function(knex) {
  return knex('posts').del()
      .then(function () {
        return knex('posts').insert([
          {title: 'Jak zacząć swoją przygodę z programowaniem', snippet: 'Kilka porad jak zaczac swoja zacząć swoją przygode z programowaniem.', content: `W dzisiejszych czasach programowanie staje się coraz bardziej popularne i dostępne dla każdego. Jeśli zastanawiasz się, jak zacząć swoją przygodę z programowaniem, warto zacząć od nauki podstawowych języków programowania, takich jak JavaScript, Python lub Java. Istnieje wiele darmowych i płatnych kursów online, które mogą Ci pomóc w nauce. Pamiętaj także o praktyce - im więcej kodu napiszesz, tym lepiej się nauczysz. Nie zrażaj się trudnościami na początku, bo każdy z nas był kiedyś początkującym programistą! A wy macie jakieś propozycje lub porady? Podzielcie się nimi w komentarzach!
          `, author: 'admin'},
          {title: 'Przydatne narzędzia dla programistów', snippet: 'Propozycje narzędzi ułatwiających pracę.', content: `W dzisiejszym świecie programowania istnieje wiele narzędzi i aplikacji, które mogą ułatwić życie każdemu programiście. Oto pięć przydatnych narzędzi, które mogą Ci się przydać: \n
            1. Visual Studio Code - lekki i wszechstronny edytor kodu, który oferuje wiele funkcji, takich jak podświetlanie składni, debugowanie, kontrole wersji i wiele innych.\n
            2. Git - system kontroli wersji, który pozwala śledzić zmiany w kodzie, współpracować z innymi programistami i przechowywać kod w repozytoriach.\n
            3. Postman - narzędzie do testowania API, które umożliwia wysyłanie zapytań HTTP, sprawdzanie odpowiedzi i debugowanie interakcji z serwerem.\n
            4. Docker - platforma do konteneryzacji aplikacji, która umożliwia izolowanie aplikacji w kontenerach, co ułatwia ich instalację, uruchamianie i skalowanie.\n
            5. Stack Overflow - społeczność programistów, która oferuje bogatą bazę wiedzy i pomaga rozwiązywać problemy związane z programowaniem poprzez zadawanie i udzielanie pytań.\n
            Wypróbuj te narzędzia i zobacz, jak mogą ułatwić Twoją pracę jako programisty!
          `, author: 'admin'}
        ]);
      });
};