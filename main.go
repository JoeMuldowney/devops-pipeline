package main

import (
	"awesomeProject/api/billing"
	"awesomeProject/api/cart"
	"awesomeProject/api/shipping"
	"github.com/rs/cors"
	"net/http"
)

func main() {

	mux := http.NewServeMux()

	mux.HandleFunc("/cart/getcartbook", cart.GetCartBook)
	mux.HandleFunc("/cart/cart", cart.SaveCartItem)
	mux.HandleFunc("/cart/checkout", cart.GetCheckOut)
	mux.HandleFunc("/cart/delete", cart.DeleteCartItem)
	mux.HandleFunc("/cart/deleteall", cart.DeleteAllCartItem)
	mux.HandleFunc("/cart/membershipcard", billing.AddMembershipCard)
	mux.HandleFunc("/cart/cartupdate/{id}", cart.UpdateCartItem)
	mux.HandleFunc("/cart/addcard", billing.AddCard)
	mux.HandleFunc("/cart/allcard", billing.GetAllCard)
	mux.HandleFunc("/cart/billing", billing.GetCard)
	mux.HandleFunc("/cart/updatecard", billing.UpdateCardPayment)
	mux.HandleFunc("/cart/address", shipping.AddAddress)
	mux.HandleFunc("/cart/shipping", shipping.GetAddress)
	mux.HandleFunc("/cart/allshipping", shipping.GetAllAddress)
	mux.HandleFunc("/cart/updateshipping", shipping.UpdateShippingAddress)

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		Debug:            true,
	})

	handler := c.Handler(mux)

	err := http.ListenAndServe(":8020", handler)
	if err != nil {
		return
	}

}
